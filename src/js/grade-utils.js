const gradeUtils = {
    calcGradePointAverage: function (grades) {
        let sum = 0;
        let weightSum = 0;
        if (!grades) return undefined;
        grades.forEach(grade => {
            const weight = grade.weight ? Number(grade.weight) : 0;
            const val = grade.val ? Number(grade.val) : 0;
            sum += val * weight;
            weightSum += weight;
        })
        if (weightSum == 0) return 0;
        return (sum / weightSum).toFixed(2);
    },
    getGradesFromPeriod: function (grades, from, to) {
        return grades.filter(grade => {
            const date = new Date(grade.date);
            const fromDate = new Date(from);
            const toDate = new Date(to);
            return (date.getTime() >= fromDate.getTime() && date.getTime() <= toDate.getTime());
        });
    }
}

module.exports = gradeUtils;
