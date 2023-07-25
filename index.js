const RANDOM_STRING = "09536f52a5e5ea14d81524f6";
const API_ENDPOINT = `https://v6.exchangerate-api.com/v6/${RANDOM_STRING}/latest/`;

const dom = {
    fromCur: document.querySelector("#fromCur"),
    toCur: document.querySelector("#toCur"),
    amount: document.querySelector("#amount"),
    getBtn: document.querySelector("form button"),
    exIcon: document.querySelector(".reverse"),
    exRateTxt: document.querySelector(".result"),
    fromFlag: document.querySelector("#fromFlag"),
    toFlag: document.querySelector("#toFlag"),
};

function populateCurrencies() {
    [dom.fromCur, dom.toCur].forEach((select, i) => {
        for (let curCode in Country_List) {
            const selected = (i === 0 && curCode === "UAH") || (i === 1 && curCode === "USD") ? "selected" : "";
            select.insertAdjacentHTML("beforeend", `<option value="${curCode}" ${selected}>${curCode}</option>`);
        }
        select.addEventListener("change", updateFlags);
    });
}

async function getExchangeRate(fromCurrency, toCurrency) {
    const response = await fetch(`${API_ENDPOINT}${fromCurrency}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.conversion_rates[toCurrency];
}

function updateConversion() {
    const amountVal = dom.amount.value || 1;
    dom.exRateTxt.innerText = "Getting exchange rate...";

    getExchangeRate(dom.fromCur.value, dom.toCur.value)
        .then(exchangeRate => {
            const totalExRate = (amountVal * exchangeRate).toFixed(2);
            dom.exRateTxt.innerText = `${amountVal} ${dom.fromCur.value} = ${totalExRate} ${dom.toCur.value}`;
        })
        .catch(error => {
            dom.exRateTxt.innerText = "Something went wrong...";
            console.error('Error:', error);
        });
}

function updateFlags(event) {
    const imgTag = event.target.parentElement.querySelector("img");
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[event.target.value].toLowerCase()}.png`;
    imgTag.alt = `${Country_List[event.target.value]} flag`;
}

function swapCurrencies() {
    [dom.fromCur.value, dom.toCur.value] = [dom.toCur.value, dom.fromCur.value];
    [dom.fromFlag.src, dom.toFlag.src] = [dom.toFlag.src, dom.fromFlag.src];
    [dom.fromFlag.alt, dom.toFlag.alt] = [dom.toFlag.alt, dom.fromFlag.alt];

    updateConversion();
}

window.addEventListener("DOMContentLoaded", () => {
    populateCurrencies();
    updateConversion();
});

dom.getBtn.addEventListener("click", event => {
    event.preventDefault();
    updateConversion();
});

dom.exIcon.addEventListener("click", swapCurrencies);
[dom.fromCur, dom.toCur, dom.amount].forEach(el => el.addEventListener("change", updateConversion));
