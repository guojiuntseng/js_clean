import moment from 'moment'

export class Budget {
    budgets = {}

    query(startDate, endDate) {

        const momentStartDate = moment(startDate, 'YYYY-MM-DD')
        const momentEndDate = moment(endDate, 'YYYY-MM-DD')

        if (momentStartDate.isSame(momentEndDate, 'month')) {
            const diffDays = momentEndDate.diff(momentStartDate, 'days') + 1
            const budget = ((this.budgets[momentStartDate.format('YYYY-MM')] || 0) / momentStartDate.daysInMonth()) * diffDays
            return budget
        } else {
            let budget = 0

            // start month
            const numberOfDaysInStartMonth = moment(momentStartDate).endOf('month').diff(momentStartDate, 'days') + 1
            const amountDaysFirst = momentStartDate.daysInMonth()
            const firstMonthBudget = this.budgets[momentStartDate.format('YYYY-MM')] || 0
            const totalBudgetFirstMonth = numberOfDaysInStartMonth * (firstMonthBudget / amountDaysFirst)
            budget += totalBudgetFirstMonth

            // months in between
            const monthDiff = momentEndDate.diff(momentStartDate, 'months') - 1
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(startDate, 'YYYY-MM-DD')
                    .add(month, 'month')
                    .format('YYYY-MM')
                const budgetThisMonth = this.budgets[monthString] || 0
                budget += budgetThisMonth
            }

            // end month
            const numberOfDaysInLastMonth = momentEndDate.diff(moment(momentEndDate).startOf('month'), 'days') + 1
            const amountDaysLast = momentEndDate.daysInMonth()
            const lastMonthBudget = this.budgets[momentEndDate.format('YYYY-MM')] || 0
            const totalBudgetLastMonth = numberOfDaysInLastMonth * (lastMonthBudget / amountDaysLast)
            budget += totalBudgetLastMonth
            return budget
        }
    }
}

