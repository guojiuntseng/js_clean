import moment from 'moment'

class Period {
    constructor (start, end) {
        this.start = start;
        this.end = end;
    }

    dayCount() {
        return this.end.diff(this.start, 'days') + 1
    }
}


export class Budget {
    budgets = {}

    query(startDate, endDate) {
        this._query(new Period(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')));
    }

    _query(period) {

        if (period.start.isSame(period.end, 'month')) {
            return this._getAmountOfPeriod(period)
        } else {
            let budget = 0

            // start month
            budget += this._getAmountOfPeriod(new Period(period.start, moment(period.start).endOf('month')))

            // months in between
            const monthDiff = period.end.diff(period.start, 'months') - 1
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(period.start)
                    .add(month, 'month')
                    .format('YYYY-MM')
                budget += this.budgets[monthString] || 0
            }

            // end month
            budget += this._getAmountOfPeriod(new Period(moment(period.end).startOf('month'), period.end))
            return budget
        }
    }

    _getAmountOfPeriod(period) {
        const diffDays = period.dayCount;
        const dayCountOfBudget = period.start.daysInMonth();
        const amountOfBudget = this.budgets[period.start.format('YYYY-MM')] || 0;
        return amountOfBudget / dayCountOfBudget * diffDays;
    }
}

