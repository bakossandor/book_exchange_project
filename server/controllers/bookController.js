const Book = require("../models/book")

module.exports = {
    async addBook (req, res) {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            info:  req.body.info,
            listedAt: new Date(),
            listedBy: req.body.listedBy,
            status: req.body.status
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

    async getBooks (req, res) {
        console.log("req.query :", req.query)
        const page = Number(req.query.page)
        const limit = Number(req.query.rowsPerPage)
        const sort = req.query.sortBy
        const desc = req.query.descending === 'true' ? -1 : 1
        try {
            const findBooks = await Book.paginate({}, {
                page,
                limit,
                sort: {
                    [sort]: desc
                }
            })
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
    
    async deleteBook (req, res) {
        try {
            const _id = req.body._id
            const deletedBookResponse = await Book.findOneAndDelete({_id})
            res.status(201).send({
                message: `${deletedBookResponse.title} book has been deleted from the list`
            })

        } catch (error) {
            console.log("error with deleting the document", error)
            res.status(400).send({
                error
            })
        }
    }
}
