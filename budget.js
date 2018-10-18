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

class Budget {
    constructor (month, amount) {
        this.amount = amount || 0
    }

    dayCount() {
        return new Period(moment(this.month, 'YYYY-MM').startOf('month'), moment(this.month, 'YYYY-MM').endOf('month')).dayCount()
    }
    getPeriod() {
        return new Period(moment(this.month, 'YYYY-MM').startOf('month'), moment(this.month, 'YYYY-MM').endOf('month'))
    }
}

export class BudgetPlan {
    budgets = {}

    query(startDate, endDate) {
        this._query(new Period(moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')));
    }

    _query(period) {

        if (period.start.isSame(period.end, 'month')) {
            let firstBudget = new Budget(period.start.format('YYYY-MM'), this.budgets[period.start.format('YYYY-MM')]);
            return this._getAmountOfOverlapping(period, firstBudget)
        } else {
            let budget = 0

            // start month
            let firstBudget = new Budget(period.start.format('YYYY-MM'), this.budgets[period.start.format('YYYY-MM')]);
            budget += this._getAmountOfOverlapping(period, firstBudget)

            // months in between
            const monthDiff = period.end.diff(period.start, 'months') - 1
            for (let month = 1; month <= monthDiff; month++) {
                const monthString = moment(period.start)
                    .add(month, 'month')
                    .format('YYYY-MM')
                budget += this.budgets[monthString] || 0
            }

            // end month
            let lastBudget = new Budget(period.end.format('YYYY-MM'), this.budgets[period.end.format('YYYY-MM')]);
            budget += this._getAmountOfOverlapping(period, lastBudget)
            return budget
        }
    }

    _getAmountOfOverlapping(period, budget) {
        let overlappingDayCount = this._getOverlappingDayCount(period, budget.getPeriod());
        return budget.amount / budget.dayCount() * overlappingDayCount;
    }

    _getOverlappingDayCount(period, another) {
        let endOfOverlapping = period.end.isBefore(another.end) ? period.end : another.end;
        let startOfOverlapping = period.start.isAfter(another.start) ? period.start : another.start
        return new Period(startOfOverlapping, endOfOverlapping).dayCount();
    }

    _getAmountOfPeriod(period, budget) {
        return budget.amount / budget.dayCount() * period.dayCount();
    }
}

