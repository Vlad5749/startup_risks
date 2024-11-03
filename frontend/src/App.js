import React, { useState } from 'react'

function App() {
    const operationalQuestions = [
        'Ризик втрати клієнтської бази',
        'Ризик втрати постачальника',
        'Ризик втрати ринкової долі',
        'Ризик зниження рівня управління',
        'Ризик виробничого конфлікту і неефективної мотивації',
        'Ризик зниження якості процесів',
        'Ризик зниження продуктивності праці',
        'Ризик незабезпеченості ресурсами',
        'Ризики персоналу',
    ]

    const investmentQuestions = [
        'Ризик неефективності інвестицій',
        'Ризик недосягнення цілей по віддачі на інвестований капітал',
        'Ризик зриву термінів створення виробничих фондів',
        'Ризик перевищення обсягу стартових інвестицій',
        'Ризик браку інвестиційного капіталу',
    ]

    const financialQuestions = [
        'Ризик неефективного використання капіталу',
        'Ризик збитковості',
        'Ризик втрати інвестора',
        'Ризик втрати платоспроможності',
        'Ризик неоптимальної ціни капіталу',
    ]

    const innovationQuestions = [
        'Ризик неефективних інноваційних інвестицій',
        'Ризик неефективного просування інновацій',
        'Ризики зриву термінів розробки інновацій',
        'Ризики порушення технологій інновацій',
        'Ризики ресурсної недостатності при проектуванні інновацій',
    ]

    const defaultOperationalRisks = [
        ['H', 0.8],
        ['H', 0.7],
        ['HC', 0.9],
        ['H', 0.6],
        ['HC', 0.7],
        ['C', 0.5],
        ['H', 0.7],
        ['H', 0.8],
        ['H', 0.9],
    ]
    const defaultInvestmentRisks = [
        ['HC', 0.7],
        ['H', 0.5],
        ['C', 0.6],
        ['HC', 0.8],
        ['HC', 0.9],
    ]
    const defaultFinancialRisks = [
        ['HC', 0.3],
        ['HC', 0.6],
        ['HC', 0.2],
        ['H', 0.7],
        ['H', 0.6],
    ]
    const defaultInnovationRisks = [
        ['H', 0.8],
        ['H', 0.9],
        ['HC', 0.1],
        ['HC', 0.7],
        ['HC', 0.6],
    ]

    const [operationalRisks, setOperationalRisks] = useState(
        defaultOperationalRisks
    )
    const [investmentRisks, setInvestmentRisks] = useState(
        defaultInvestmentRisks
    )
    const [financialRisks, setFinancialRisks] = useState(defaultFinancialRisks)
    const [innovationRisks, setInnovationRisks] = useState(
        defaultInnovationRisks
    )
    const [result, setResult] = useState('')

    const handleRiskChange = (riskData, setRiskData, index, type, value) => {
        const newRisks = [...riskData]
        if (type === 'term') newRisks[index][0] = value
        if (type === 'confidence') newRisks[index][1] = parseFloat(value)
        setRiskData(newRisks)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch(
            'http://localhost:5000/api/calculate-risk',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operational_risks: operationalRisks,
                    investment_risks: investmentRisks,
                    financial_risks: financialRisks,
                    innovation_risks: innovationRisks,
                }),
            }
        )

        const data = await response.json()
        setResult(data.result)
    }

    const renderRiskInputs = (questions, riskData, setRiskData) => (
        <table
            style={{
                width: '50%',
                margin: '20px auto',
                borderCollapse: 'collapse',
            }}
        >
            <thead>
                <tr>
                    <th
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            backgroundColor: '#f4f4f4',
                            width: '24%',
                            textAlign: 'left',
                        }}
                    >
                        Питання
                    </th>
                    <th
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            backgroundColor: '#f4f4f4',
                            width: '13%',
                            textAlign: 'center',
                        }}
                    >
                        Терм оцінка
                    </th>
                    <th
                        style={{
                            border: '1px solid #ddd',
                            padding: '10px',
                            backgroundColor: '#f4f4f4',
                            width: '13%',
                            textAlign: 'center',
                        }}
                    >
                        Оцінка достовірності
                    </th>
                </tr>
            </thead>
            <tbody>
                {questions.map((question, index) => (
                    <tr key={index}>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                verticalAlign: 'top',
                                textAlign: 'left',
                                // backgroundColor: '#077be8', // Колір для комірок з питаннями
                            }}
                        >
                            {question}
                        </td>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                textAlign: 'center',
                            }}
                        >
                            <select
                                value={riskData[index][0]}
                                onChange={(e) =>
                                    handleRiskChange(
                                        riskData,
                                        setRiskData,
                                        index,
                                        'term',
                                        e.target.value
                                    )
                                }
                                style={{ padding: '5px' }}
                            >
                                <option value="H">H</option>
                                <option value="HC">HC</option>
                                <option value="C">C</option>
                                <option value="BC">BC</option>
                                <option value="B">B</option>
                            </select>
                        </td>
                        <td
                            style={{
                                border: '1px solid #ddd',
                                padding: '10px',
                                textAlign: 'center',
                            }}
                        >
                            <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={riskData[index][1]}
                                onChange={(e) =>
                                    handleRiskChange(
                                        riskData,
                                        setRiskData,
                                        index,
                                        'confidence',
                                        e.target.value
                                    )
                                }
                                style={{ padding: '5px', width: '60px' }}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Оцінка ризику фінансування проекту</h1>
            <form onSubmit={handleSubmit}>
                <h2>Операційні ризики</h2>
                {renderRiskInputs(
                    operationalQuestions,
                    operationalRisks,
                    setOperationalRisks
                )}

                <h2>Інвестиційні ризики</h2>
                {renderRiskInputs(
                    investmentQuestions,
                    investmentRisks,
                    setInvestmentRisks
                )}

                <h2>Фінансові ризики</h2>
                {renderRiskInputs(
                    financialQuestions,
                    financialRisks,
                    setFinancialRisks
                )}

                <h2>Ризики інноваційної діяльності</h2>
                {renderRiskInputs(
                    innovationQuestions,
                    innovationRisks,
                    setInnovationRisks
                )}

                <button
                    type="submit"
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Розрахувати ризик
                </button>
            </form>
            <h2>Результат: {result}</h2>
        </div>
    )
}

export default App
