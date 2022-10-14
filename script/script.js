const formatCurrency = (n) => {
    const currency = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    });

    return currency.format(n);
}

//Или формат записи
// const formatCurrency = n => 
//     new Intl.NumberFormat('ru-RU', {
//         style: 'currency',
//         currency: 'RUB',
//         maximumFractionDigits: 2,
//     }).format(n);


// -----function debounce
const deBounceTimer = (fn, msec) => {
    let lastCall = 0;
    let lastCallTimer;

    return (...arg) => {
        const privioseCall = lastCall;
        lastCall = Date.now();

        if (privioseCall && ((lastCall - privioseCall) <= msec)) {
            clearTimeout()
        }

        lastCallTimer = setTimeout(() => {
            fn(...arg);
        }, msec)
    }
}

{// ---------------------------------Новигация
    const navigationLinks = document.querySelectorAll('.navigation__link');
    const calcElems = document.querySelectorAll('.calc');

    for (let i = 0; i < navigationLinks.length; i++) {
        navigationLinks[i].addEventListener('click', (e) => {
            e.preventDefault();
            //Отключение стандартного браузерного поведения при клике по ссылке

            for (j = 0; j < calcElems.length; j++) {
                if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
                    calcElems[j].classList.add('calc_active');
                    navigationLinks[i].classList.add('navigation__link_active');
                } else {
                    calcElems[j].classList.remove('calc_active');
                    navigationLinks[j].classList.remove('navigation__link_active');
                }
            }
        })
    }
}

{//--------------------------АУСН
    const ausn = document.querySelector('.ausn');
    const formAusn = ausn.querySelector('.calc__form');
    const resultTaxTotal = ausn.querySelector('.result__tax_total');
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

    calcLabelExpenses.style.display = 'none';

    formAusn.addEventListener('input', deBounceTimer(() => {
        const income = +formAusn.income.value;
        if (formAusn.type.value === 'income') {
            calcLabelExpenses.style.display = 'none';
            resultTaxTotal.textContent = formatCurrency(income * 0.08);
            formAusn.expenses.value = 0;

        } if (formAusn.type.value === 'expenses') {
            const expenses = +formAusn.expenses.value;
            const profit = income - expenses < 0 ? 0 : income - expenses;
            calcLabelExpenses.style.display = 'block';
            resultTaxTotal.textContent = formatCurrency(profit * 0.2);
        }
    }, 1000));
}


{//-----------------------------------------------Самозанятый и ИП НПД
    const selfEmployment = document.querySelector('.self-employment');
    const formSelfEmployment = selfEmployment.querySelector('.calc__form');
    const resultTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
    const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
    const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
    const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
    const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
    const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

    const checkCompensation = () => {
        const setDisplay = formSelfEmployment.addCompensation.checked ? 'block' : 'none';
        calcCompensation.style.display = setDisplay;
        //  Или
        // if (formSelfEmployment.addCompensation.checked === true) {
        //     calcCompensation.style.display = 'block';
        // } else {
        //     calcCompensation.style.display = 'none';
        // }

        resultBlockCompensation.forEach((elem) => {
            elem.style.display = setDisplay;
        })
    };

    checkCompensation();


    formSelfEmployment.addEventListener('input', deBounceTimer(() => {
        const individual = +formSelfEmployment.individual.value;
        const entity = +formSelfEmployment.entity.value;
        const resIndividual = individual * 0.04;
        const resEntity = entity * 0.06;

        checkCompensation();

        const tax = resIndividual + resEntity;

        formSelfEmployment.compensation.value = +formSelfEmployment.compensation.value > 10_000 ? 10_000 : formSelfEmployment.compensation.value
        const benefit = +formSelfEmployment.compensation.value;
        const resBenefit = individual * 0.01 + entity * 0.02;
        const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
        const finalTax = tax - (benefit - finalBenefit);

        resultTaxSelfEmployment.textContent = formatCurrency(tax);
        resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
        resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
        resultTaxResult.textContent = formatCurrency(finalTax);
    }, 1000));
}



{//----------------------------------------------ОСНО
    const osno = document.querySelector('.osno');
    const formOsno = osno.querySelector('.calc__form');

    const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
    const ndflIncome = osno.querySelector('.result__block_ndfl-income');
    const profit = osno.querySelector('.result__block_profit');

    const checkFormBusness = () => {
        if (formOsno.formBusness.value === 'ip') {
            ndflExpenses.style.display = '';
            ndflIncome.style.display = '';
            profit.style.display = 'none';
        } else if (formOsno.formBusness.value === 'ooo') {
            ndflExpenses.style.display = 'none';
            ndflIncome.style.display = 'none';
            profit.style.display = '';
        }
    };

    checkFormBusness();

    const resultTaxNds = osno.querySelector('.result__tax_nds');
    const resultTaxProperty = osno.querySelector('.result__tax_property');
    const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
    const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
    const resultTaxProfit = osno.querySelector('.result__tax_profit');

    formOsno.addEventListener('input', deBounceTimer(() => {
        checkFormBusness();

        const income = +formOsno.income.value;
        const expenses = +formOsno.expenses.value;
        const property = +formOsno.property.value;

        const profit = income - expenses ? 0 : income - expenses;
        // НДС
        const nds = income * 0.2;
        resultTaxNds.textContent = formatCurrency(nds);
        // Налог на имущество
        const taxProperty = property * 0.02;
        resultTaxProperty.textContent = formatCurrency(taxProperty);
        //НДФЛ(Вычет в виде расходов)
        const ndflExpensesTotal = profit * 0.13;
        resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
        //НДФЛ(Вычет 20% от доходов)
        const ndflIncomeTotal = (income - nds) * 0.13;
        resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);
        //Налог на прибыль 20%
        const taxProfit = profit * 0.2;
        resultTaxProfit.textContent = formatCurrency(taxProfit);
    }, 1000));
}


{//--------------------------------УСН
    const LIMIT = 300_000;
    const usn = document.querySelector('.usn');
    const formUsn = usn.querySelector('.calc__form');

    const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
    const calcLabelProperty = usn.querySelector('.calc__label_property');
    const resultBlockProperty = usn.querySelector('.result__block_property');

    const resultTaxTotal = usn.querySelector('.result__tax_total');
    const resultTaxProperty = usn.querySelector('.result__tax_property');


    const checkShopProperty = (typeTax) => {
        // if (formUsn.typeTax.value === 'income') {
        //     calcLabelExpenses.style.display = 'none';
        //     calcLabelProperty.style.display = 'none';
        //     resultBlockProperty.style.display = 'none';

        //     formUsn.expenses.value = '';
        //     formUsn.property.value = '';

        // } else if (formUsn.typeTax.value === 'ip-expenses') {
        //     calcLabelExpenses.style.display = '';
        //     calcLabelProperty.style.display = 'none';
        //     resultBlockProperty.style.display = 'none';

        //     formUsn.property.value = '';

        // } else if (formUsn.typeTax.value === 'ooo-expenses') {
        //     calcLabelExpenses.style.display = '';
        //     calcLabelProperty.style.display = '';
        //     resultBlockProperty.style.display = '';
        // }

        switch (typeTax) {
            case 'income': {
                calcLabelExpenses.style.display = 'none';
                calcLabelProperty.style.display = 'none';
                resultBlockProperty.style.display = 'none';

                formUsn.expenses.value = '';
                formUsn.property.value = '';
                break;
            };

            case 'ip-expenses': {
                calcLabelExpenses.style.display = '';
                calcLabelProperty.style.display = 'none';
                resultBlockProperty.style.display = 'none';

                formUsn.property.value = '';
                break;
            };

            case 'ooo-expenses': {
                calcLabelExpenses.style.display = '';
                calcLabelProperty.style.display = '';
                resultBlockProperty.style.display = '';
                break;
            };
        }
    }

    // const typeTax = {
    //     'income': () => {
    //         calcLabelExpenses.style.display = 'none';
    //         calcLabelProperty.style.display = 'none';
    //         resultBlockProperty.style.display = 'none';
    //         formUsn.expenses.value = '';
    //         formUsn.property.value = '';
    //     },
    //     'ip-expenses': () => {
    //         calcLabelExpenses.style.display = '';
    //         calcLabelProperty.style.display = 'none';
    //         resultBlockProperty.style.display = 'none';
    //         formUsn.property.value = '';
    //     },
    //     'ooo-expenses': () => {
    //         calcLabelExpenses.style.display = '';
    //         calcLabelProperty.style.display = '';
    //         resultBlockProperty.style.display = '';
    //     },
    // };
    const persent = {
        'income': 0.06,
        'ip-expenses': 0.15,
        'ooo-expenses': 0.15,
    }

    // typeTax[formUsn.typeTax.value]();
    // checkShopProperty();
    checkShopProperty(formUsn.typeTax.value);

    formUsn.addEventListener('input', deBounceTimer(() => {
        // typeTax[formUsn.typeTax.value]();
        // checkShopProperty();
        checkShopProperty(formUsn.typeTax.value);

        const income = +formUsn.income.value;
        const expenses = +formUsn.expenses.value;
        const contributions = +formUsn.contributions.value;
        const property = +formUsn.property.value;

        let profit = income - contributions;
        if (formUsn.typeTax.value !== 'income') {
            profit -= expenses;
        }

        const taxBifIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
        const summ = profit - (taxBifIncome < 0 ? 0 : taxBifIncome);
        const tax = summ * persent[formUsn.typeTax.value];
        const taxProperty = property * 0.02;

        resultTaxTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
        resultTaxProperty.textContent = formatCurrency(taxProperty);
    }, 1000));

}

{//----------------------------------Налоговый вычет 13%-----------------------------------

    const taxReturn = document.querySelector('.tax-return');
    const formTaxReturn = taxReturn.querySelector('.calc__form');

    const resultTaxNdf = taxReturn.querySelector('.result__tax_ndfl');
    const resultTaxPossibl = taxReturn.querySelector('.result__tax_possible');
    const resultTaxDeductoin = taxReturn.querySelector('.result__tax_deductoin');

    formTaxReturn.addEventListener('input', deBounceTimer(() => {
        const income = +formTaxReturn.income.value;
        const expenses = +formTaxReturn.expenses.value;

        const sumExpenses = +formTaxReturn.sumExpenses.value;

        const ndfl = income * 0.13;
        const possibleDeduction = expenses < sumExpenses ? expenses * 0.13 : sumExpenses * 0.13;
        const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;

        resultTaxNdf.textContent = formatCurrency(ndfl);
        resultTaxPossibl.textContent = formatCurrency(possibleDeduction);
        resultTaxDeductoin.textContent = formatCurrency(deduction);
    }, 1000));
}
