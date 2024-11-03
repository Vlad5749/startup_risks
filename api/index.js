const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 5000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

// Обробка POST-запиту для оцінки ризиків
app.post('/api/calculate-risk', (req, res) => {
    const {
        operational_risks,
        investment_risks,
        financial_risks,
        innovation_risks,
    } = req.body

    // отримаємо результуючі терм оцінки для всіх груп критеріїв
    op_term = resulting_term_estimate(operational_risks)
    inv_term = resulting_term_estimate(investment_risks)
    fin_term = resulting_term_estimate(financial_risks)
    inn_term = resulting_term_estimate(innovation_risks)

    // отримуємо агреговані терм оцінки по всім групам критеріїв
    op_agg = aggregate_reliability_score(operational_risks, op_term)
    inv_agg = aggregate_reliability_score(investment_risks, inv_term)
    fin_agg = aggregate_reliability_score(financial_risks, fin_term)
    inn_agg = aggregate_reliability_score(innovation_risks, inn_term)

    // отримаємо узагальнені оцінки по всім групам критеріїв
    op_gen = generalized_assessment(op_term, op_agg)
    inv_gen = generalized_assessment(inv_term, inv_agg)
    fin_gen = generalized_assessment(fin_term, fin_agg)
    inn_gen = generalized_assessment(inn_term, inn_agg)

    // отримаємо рівень безпеки фінансування проекту
    finalResult = result(op_gen, inv_gen, fin_gen, inn_gen)

    res.json({ result: finalResult })
})

// повертає рівень безпеки фінансування проекту
function result(op_gen, inv_gen, fin_gen, inn_gen) {
    summ =
        (1 / 4) * (1 - op_gen + (1 - inv_gen) + (1 - fin_gen) + (1 - inn_gen))

    if (summ > 0.87 && summ <= 1) {
        return 'незначний ступінь ризику проекту'
    } else if (summ > 0.67 && summ <= 0.87) {
        return 'низький ступінь ризику проекту'
    } else if (summ > 0.36 && summ <= 0.67) {
        return 'середній ступінь ризику проекту'
    } else if (summ > 0.21 && summ <= 0.36) {
        return 'високий ступінь ризику проекту'
    } else if (summ >= 0 && summ <= 0.21) {
        return 'граничний ступінь ризику проекту'
    }
}

// повертає узагальнену оцінку на основі терм-оцінки і агрегованої оцінки
function generalized_assessment(term, agg) {
    let a

    switch (term) {
        case 'H':
            a = 20
            break
        case 'HC':
            a = 40
            break
        case 'C':
            a = 60
            break
        case 'BC':
            a = 80
            break
        case 'B':
            a = 100
            break
    }

    return ((a - Math.sqrt((1 - agg) / 2) * 20) / 100).toFixed(2)
}

// повертає агреговану оцінку достовірності
function aggregate_reliability_score(arr, term) {
    term_count = 0
    term_summ = 0

    for (i = 0; i < arr.length; i++) {
        if (arr[i][0] == term) {
            term_count++
            term_summ += arr[i][1]
        }
    }

    return ((1 / term_count) * term_summ).toFixed(2)
}

// повертає результуючу терм оцінку
function resulting_term_estimate(arr) {
    let count_risks = {
        H: 0,
        HC: 0,
        C: 0,
        BC: 0,
        B: 0,
    }

    for (let i = 0; i < arr.length; i++) {
        count_risks[arr[i][0]]++
    }

    max_name = ''
    max_value = 0

    for (let key in count_risks) {
        if (count_risks[key] > max_value) {
            max_value = count_risks[key]
            max_name = key
        }
    }

    if (max_value / arr.length >= 0.6) {
        return max_name
    } else {
        return console.log('Помилка. Введенні некоректні оцінки ризику')
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
