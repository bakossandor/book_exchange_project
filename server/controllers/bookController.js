const Book = require("../models/book")
const Trade = require("../models/trade")
const User = require("../models/user")
const JWT = require("../util/token")

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
    
            
            if (docs.length >= 1) {
                
                // async function findTrade (status, bookId) {
                //     const book = await Trade.find({[status]: bookId})
                //     return book
                // }

                // async function findTrade (arrayOfBooks) {
                //     let promises = [];
                //     for (let i = 0; i < arrayOfBooks.length; i++) {
                //       promises.push(
                //           Book.find({_id: arrayOfBooks[i].listedBy}))
                //     }
                //     const result = await Promise.all(promises);
                //     return result
                // }


                const sacrifice = docs.filter((book) => {
                    return book.status === "sacrifice"
                })

                if (sacrifice.length > 0) {
                    const sacrificeBooks = await findTrade()
                    console.log("sacrifice :", sacrificeBooks)
                }

                const thinking = docs.filter((book) => {
                    return book.status === "thinking"
                })

                docs.forEach((book) => {
                    book.new = "new"
                })
                console.log("new ", docs)
                res.send({
                    books: docs,
                    total: total
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
            const responses = await Promise.all([
                Book.findByIdAndUpdate(req.body.initiaterBook, {status: "sacrifice"}, {new: true}),
                Book.findByIdAndUpdate(req.body.receiverBook, {status: "thinking"}, {new: true}),
                trade.save()
            ])
            console.log("trade request response: ", responses)
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
            console.log("decline request --- :", req.body)
            const responses = await Promise.all([
                //the own book and user update
                Book.findByIdAndUpdate(req.body.offered_id, {tradeStatus: "pending", status: "pending"}),
                User.findByIdAndUpdate(req.body.offered_userId, {$push: {pendingBooks: req.body.offered_id}}),
                //the trader update
                Book.findByIdAndUpdate(req.body.requested_id, {status: "pending", tradeStatus: "pending"}),
                User.findByIdAndUpdate(req.body.requested_userId, {$push: {pendingBooks: req.body.requested_id}, $pull: {offeredBooks: req.body.requested_id}})
            ])
        } catch (error) {
            console.log("error with the tradeRequest request --- ", error)
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
