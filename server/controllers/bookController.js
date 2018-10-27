const Book = require("../models/book")
const Trade = require("../models/trade")
const User = require("../models/user")
const JWT = require("../util/token")
const ObjectId = require("mongoose").Types.ObjectId

module.exports = {
    async addBook(req, res) {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            info:  req.body.info,
            listedAt: new Date(),
            listedBy: req.body.listedBy,
            listedByUserName: req.body.listedByUserName,
            status: "listed"
        })
        try {
            const savedBook = await book.save()
            const userUpdate = await User.findOneAndUpdate({_id: req.body.listedBy}, {$push: {books: savedBook._id}}, {new: true})
            console.log("userUpdate :", userUpdate)
            res.status(201).send({
                message: `${book.title} listed saved successfully`
            })
        } catch (error) {
            console.log("error with saving book document", error)
            res.status(400).send({
                error
            })
        }
    },

    async getBooks(req, res) {
        const query = JSON.parse(req.query.query)
        const searchValue = req.query.searchValue === undefined ? "" : req.query.searchValue
        const page = Number(query.page)
        const limit = Number(query.rowsPerPage)
        const sort = query.sortBy
        const desc = query.descending === true ? -1 : 1
        try {
            const findBooks = await Book.paginate(
                {
                    $or: [
                        {title: {$regex: searchValue, $options: "i"}, status: "listed", tradeStatus: {$exists: false}},
                        {author: {$regex: searchValue, $options: "i"}, status: "listed", tradeStatus: {$exists: false}},
                    ]
                },
                {
                    page,
                    limit,
                    sort: {
                        [sort]: desc
                    }
                }
            )
            res.send({
                books: findBooks.docs,
                total: findBooks.total
            })
        } catch (error) {
            console.log("error finding the books", error)
            res.status(400).send({
                error
            })
        }
    },

    async getTradeBooks(req, res) {
        try {
            // console.log("get trade books --- ", req.params)
            const offeredBooksArray = await User.find({_id: req.params.id}, "offeredBooks")
            const pendingBooks = await User.find({_id: req.params.id}, "pendingBooks")
            //==== build in
            console.log("pendingBooks books : -----", pendingBooks)
            booksCollection = pendingBooks[0].pendingBooks.concat(offeredBooksArray[0].offeredBooks)
            console.log("booksCollection ---------- :", booksCollection)
            console.log("to replace :", offeredBooksArray[0].offeredBooks)

            //===== build in

            // console.log("trade --- offerred books :", offeredBooksArray[0].offeredBooks)
            const booksToReturn = await Book.find({_id: {$in: booksCollection}})
            async function findCounter (items) {
                let promises = [];
                for (let i = 0; i < items.length; i++) {
                  promises.push(Book.find((items[i].traderBookId)));
                }
                const result = await Promise.all(promises);
                return result
            }
            const findCounterBook = await findCounter(booksToReturn)
            const counterBook = findCounterBook.reduce((acc, val) => acc.concat(val))
            // console.log ("findc ---- : ", findCounterBook)

            res.send({
                message: "books in the trade block",
                books: booksToReturn,
                counterBook: counterBook
            })
        } catch (error) {
            console.log("error finding the books", error)
            res.status(400).send({
                error
            })
        }
    },
    
    async changeStatus(req, res) {
        try {
            const _id = req.params.id
            const status = req.body.status
            await Book.findByIdAndUpdate(_id, {status: status}, {new: true})
            res.send({
                message: "status changed successfully"
            })
        } catch (error) {
            res.status(400).send({
                error
            })
        }
    },

    async getUserBooks(req, res) {
        try {
            const query = JSON.parse(req.query.query)
            const page = Number(query.page)
            const limit = Number(query.rowsPerPage)
            const sort = query.sortBy
            const desc = query.descending === true ? -1 : 1
            const status = req.query.status
            const listedBy = JWT.decodeUserId(req)
            
            const mongoQuery = {listedBy, status: {$in: status}}
            const {docs, total} = await Book.paginate(mongoQuery, {page, limit, sort: {[sort]: desc}, lean: true})
            
            if (docs.length > 0) {

                var booksCollection = []

                if (status[0] === "archived") {
                    booksCollection = docs
                } else if (status[0] === "pending" || status[0] === "approved") {
                    booksCollection = docs
                } else {
                    const sacrifice = docs.filter((book) => {
                        return book.status === "sacrifice"
                    })
    
                    const thinking = docs.filter((book) => {
                        return book.status === "thinking"
                    })
    
                    const listed = docs.filter((book) => {
                        return book.status === "listed"
                    })
    
                    if (sacrifice.length > 0) {
                        const sacrificeBooks = await findTrade("sacrifice", sacrifice)
                        // console.log("sacrifice :", sacrificeBooks)
                        sacrificeBooks.forEach((book) => {
                            booksCollection.push(book)
                        })
                    } 
                    
                    if (thinking.length > 0 ) {
                        const thinkingBooks = await findTrade("thinking", thinking)
                        // console.log("thinking :", thinkingBooks)
                        thinkingBooks.forEach((book) => {
                            booksCollection.push(book)
                        })
                    }
    
                    if (listed.length > 0) {
                        // console.log("listed books, :", listed)
                        listed.forEach((book) => {
                            booksCollection.push(book)
                        })
                    }
                }
                
                //finding the counter part of the listed document based on the state condition and returning an expanded book object
                async function findBooks (status, book) {
                    const tradeParam = status === "sacrifice" ? "initiaterBook": "receiverBook"
                    const counterParam = status === "sacrifice" ? "receiverBook": "initiaterBook"
                    // console.log("findbooks status :", status, "findbooks book id: ", bookId)
                    // console.log("obj id ", ObjectId(bookId))
                    const [trade] = await Trade.find({[tradeParam]: ObjectId(book._id)})
                    // console.log("trade obj ", trade)
                    const bookFindParam = trade[counterParam]
                    const [counterbook] = await Book.find({_id: bookFindParam})
                    book["counterbook"] = counterbook
                    // console.log("newBook", book)
                    return book
                }

                async function findTrade (status, arrayOfBooks) {
                    let promises = [];
                    for (let i = 0; i < arrayOfBooks.length; i++) {
                        // console.log("findtrade arrayOfBooks :", arrayOfBooks, "status: ", status)
                        promises.push(findBooks(status, arrayOfBooks[i]))
                    }
                    const result = await Promise.all(promises);
                    return result
                }

                // function sortCollections (array, prop, desc) {
                //     if (desc === -1) {
                //         return array.sort((a, b) => {
                //             return b[prop] - a[prop];
                //         })
                //     } else if (desc === 1) {
                //         return array.sort((a, b) => {
                //             return a[prop] -b[prop];
                //         })
                //     }
                // }

                // const sortedCollection = sortCollections(booksCollection, sort, desc)

                // console.log("bookscollection ----------- :", booksCollection)
                res.send({
                    books: booksCollection,
                    total: booksCollection.length
                })
            
            } else {
                res.send({
                    message: `The user has 0 ${status} book`
                })
            }
        } catch (error) {
            console.log("error with returning the userbooks books :", error)
        }
    },

    async deleteBook (req, res) {
        try {
            const _id = req.params.id
            console.log("_id: ", _id)
            const deletedBookResponse = await Book.findOneAndDelete({_id})
            console.log("---deleted book----", deletedBookResponse)
            res.status(202).send({
                message: `${deletedBookResponse.title} book has been deleted from the list`
            })

        } catch (error) {
            console.log("error with deleting the document", error)
            res.status(400).send({
                error
            })
        }
    },

    async tradeRequest(req, res) {
        console.log("req.query :", req)
        try {
            trade = new Trade({
                initiater: req.body.initiater,
                receiver: req.body.receiver,
                initiaterBook: req.body.initiaterBook,
                receiverBook: req.body.receiverBook,
                status: "requested"
            })
            const traderesponse = await trade.save()
            const responses = await Promise.all([
                Book.findByIdAndUpdate(req.body.initiaterBook, {status: "sacrifice", tradeInfo: traderesponse._id}, {new: true}),
                Book.findByIdAndUpdate(req.body.receiverBook, {status: "thinking", tradeInfo: traderesponse._id}, {new: true}),
            ])
            res.status(202).send({
                message: "traded request successfully sent"
            })
        } catch (error) {
            console.log("error with the tradeRequest request --- ", error)
            res.status(400).send({
                error
            })
        }
    },
    async acceptRequest(req, res) {
        try {
            const {receiverBook, initiaterBook, tradeInfo} = req.body
            const responses = await Promise.all([
                //to update the trade object
                Trade.findByIdAndUpdate(tradeInfo, {status: "pending"}, {new: true}),
                //update the receiver book object
                Book.findByIdAndUpdate(receiverBook, {status: "pending"}, {new: true}),
                //update the initiater book object
                Book.findByIdAndUpdate(initiaterBook, {status: "pending"}, {new: true}),
            ])
            console.log("accept request finished : ", responses)
        } catch (error) {
            console.log("error with accepting the request --- ", error)
            res.status(400).send({
                error
            })
        }
    },

    async approveRequest(req, res) {
        try {
            const {approvedBookId, tradeInfo} = req.body
            


            const [tradeObj] = await Trade.find({_id: tradeInfo})
            console.log("approve trade obj ..... ", tradeObj)

            if (tradeObj.status === "pending") {
            //if there is no approve at all
                if (approvedBookId == tradeObj.initiaterBook) {
                    // the approver is the initiater
                    // update the book and the tradeStatus
                    const approveResponse = await Promise.all([
                        Book.findOneAndUpdate({_id: approvedBookId}, {status: "approved"}),
                        Trade.findByIdAndUpdate({_id: tradeObj._id}, {status: "initiaterApproved"})
                    ])
                } else if (approvedBookId == tradeObj.receiverBook) {
                    // the approver is the receiver
                    // update the book and the tradeStatus
                    const approveResponse = await Promise.all([
                        Book.findOneAndUpdate({_id: approvedBookId}, {status: "approved"}),
                        Trade.findByIdAndUpdate({_id: tradeObj._id}, {status: "receiverApproved"})
                    ])
                }

            } else if (tradeObj.status === "initiaterApproved" && approvedBookId == tradeObj.receiverBook || tradeObj.status === "receiverApproved" && approvedBookId == tradeObj.initiaterBook) {
            // one of the party has already approved
                // to find the two book
                const [receiver, initiater] = await Promise.all([ //both resolves to an obj
                    User.findById(tradeObj.receiver),
                    User.findById(tradeObj.initiater)
                ])
                console.log("receiverBook : ----- ", receiver, "initBook :", initiater)
                // to update the 2 book and the tradeinfo and the 2 user as well
                const responses = await Promise.all([
                    
                    Book.findByIdAndUpdate(tradeObj.receiverBook, 
                        {
                            $set: {
                                status: "archived", 
                                listedBy: initiater._id, 
                                listedByUserName: initiater.userName, 
                                listedAt: new Date()
                            }, 
                            $unset: {tradeInfo: ""}
                        },  
                        {new: true}
                    ),
                    Book.findByIdAndUpdate(tradeObj.initiaterBook, 
                        {
                            $set: {
                                status: "archived", 
                                listedBy: receiver._id, 
                                listedByUserName: receiver.userName, 
                                listedAt: new Date()
                            }, $unset: {tradeInfo: ""}
                        }, 
                        {new: true}
                    ),
                    User.bulkWrite([
                        {
                            updateOne: {
                                filter: {_id: tradeObj.initiater},
                                update: {
                                    $pull: {books: tradeObj.initiaterBook}, 
                                }
                            }
                        },
                        {
                            updateOne: {
                                filter: {_id: tradeObj.initiater},
                                update: {
                                    $push: {books: tradeObj.receiverBook}, 
                                }
                            }
                        },
                        {
                            updateOne: {
                                filter: {_id: tradeObj.receiver},
                                update: {
                                    $pull: {books: tradeObj.receiverBook}, 
                                }
                            }
                        },
                        {
                            updateOne: {
                                filter: {_id: tradeObj.receiver},
                                update: {
                                    $push: {books: tradeObj.initiaterBook}, 
                                }
                            }
                        },
                    ]),
                    Trade.findOneAndUpdate(tradeObj._id, {status: "finished"}, {new: true})
                ])
                console.log("successfully traded :", responses)
            }
            res.status(202).send({
                message: "the approve request was successfull"
            })

        } catch (error) {
            console.log("error with accepting the request --- ", error)
            res.status(400).send({
                error
            })
        }
    },

    async declineRequest(req, res) {
        try {
            console.log("decline request --- :", req.body)
            const responses = await Promise.all([
                Book.findByIdAndUpdate(req.body.offered_id, {$unset: {tradeStatus: "", traderBookId: "", traderUserId: "", traderUserName: ""}}, {new: true}),
                Book.findByIdAndUpdate(req.body.requested_id, {$unset: {tradeStatus: "", traderBookId: "", traderUserId: "", traderUserName: ""}}, {new: true}),
                User.findByIdAndUpdate(req.body.offered_userId, {$pull: {offeredBooks: req.body.offered_id}}, {new: true}),
                User.findByIdAndUpdate(req.body.requested_userId, {$pull: {offeredBooks: req.body.offered_id}}, {new: true})
            ])
            console.log("responses ____ :", responses)
        } catch (error) {
            console.log("error with the cancel request --- ", error)
            res.status(400).send({
                error
            })
        }
    },
}
