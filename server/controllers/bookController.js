const Book = require("../models/book")
const JWT = require("../util/token")

module.exports = {
    async addBook(req, res) {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            info:  req.body.info,
            listedAt: new Date(),
            listedBy: req.body.listedBy,
            listedById: req.body.listedById,
            status: "listed"
        })
        try {
            await book.save()
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
                        {title: {$regex: searchValue, $options: "i"}, status: {$ne: "archived"}},
                        {author: {$regex: searchValue, $options: "i"}, status: {$ne: "archived"}},
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
            const listedById = JWT.decodeUserId(req)
            console.log("status :", status, "_id :", listedById)
            const mongoQuery = {listedById, status}
            const findBooks = await Book.paginate(mongoQuery, {page, limit, sort: {[sort]: desc}})
            console.log("books found :", findBooks)
            res.send({
                books: findBooks.docs,
                total: findBooks.total
            })
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
        try {
            const updateOne = {
                requested_id: req.body.requested_id,
                offered_username: req.body.offered_username,
                offered_userId: req.body.offered_userId,
                offered_book_info: req.body.offered_book_info
            }
            const updateTwo = {
                offered_id: req.body.offered_id,
                requested_username: req.body.requested_username,
                requested_userId: req.body.requested_userId,
                requested_book_info: req.body.requested_book_info
            }

            const responses = await Promise.all([
                Book.findByIdAndUpdate({_id: updateOne.requested_id}, {tradeStatus: "requested", traderId: updateOne.offered_userId, traderUsername: updateOne.offered_username}, {new: true}), 
                Book.findByIdAndUpdate({_id: updateTwo.offered_id}, {tradeStatus: "offered", traderId: updateTwo.requested_userId, traderUsername: updateTwo.requested_username}, {new: true})
            ])
            console.log("trade request response: ", responses)
            res.status(202).send({
                message: "traded request successfully sent"
            })
            console.log("trade Request : -- ", updateOne)
        } catch (error) {
            console.log("error with the tradeRequest request --- ", error)
            res.status(400).send({
                error
            })
        }
    },
    async acceptRequest(req, res) {
        try {
            // 
        } catch (error) {
            console.log("error with the tradeRequest request --- ", error)
            res.status(400).send({
                error
            })
        }
    }
}
