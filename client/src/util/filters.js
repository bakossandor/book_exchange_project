import moment from "moment"

export default {
    formatDate(date) {
        return moment(date).format('lll');
    }
}