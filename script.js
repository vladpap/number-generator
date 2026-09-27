const form = document.querySelector("#generator-form");
const quantityInput = document.querySelector("#quantity");
const resultsElement = document.querySelector("#results");
const messageElement = document.querySelector("#message");
const copyNotification = document.querySelector("#copy-notification");

const letters = ["Р", "Е", "С", "О"];
const maxNumbers = letters.length ** 3 * 10 ** 3;
let generatedNumbers = [];
let notificationTimeout;

function generateUniqueNumbers(quantity) {
  const allNumbers = [];

  for (const firstLetter of letters) {
    for (let digits = 0; digits < 1000; digits += 1) {
      const numberPart = String(digits).padStart(3, "0");

      for (const secondLetter of letters) {
        for (const thirdLetter of letters) {
          allNumbers.push(`${firstLetter}${numberPart}${secondLetter}${thirdLetter}`);
        }
      }
    }
  }

  for (let index = 0; index < quantity; index += 1) {
    const randomIndex = index + Math.floor(Math.random() * (allNumbers.length - index));
    [allNumbers[index], allNumbers[randomIndex]] = [
      allNumbers[randomIndex],
      allNumbers[index],
    ];
  }

  return allNumbers.slice(0, quantity);
}

function renderNumbers(numbers) {
  resultsElement.replaceChildren();

  numbers.forEach((number) => {
    const item = document.createElement("button");
    item.className = "number";
    item.type = "button";
    item.textContent = number;
    item.setAttribute("aria-label", `Скопировать номер ${number}`);
    item.addEventListener("click", () => copyNumber(number));
    resultsElement.append(item);
  });
}

async function copyNumber(number) {
  try {
    await navigator.clipboard.writeText(number);
    copyNotification.classList.add("is-visible");
    window.clearTimeout(notificationTimeout);
    notificationTimeout = window.setTimeout(() => {
      copyNotification.classList.remove("is-visible");
    }, 1000);
  } catch {
    messageElement.textContent = "Не удалось скопировать номер автоматически.";
    messageElement.style.color = "#b42318";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const quantity = Number(quantityInput.value);

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > maxNumbers) {
    messageElement.textContent = `Укажите целое число от 1 до ${maxNumbers.toLocaleString("ru-RU")}.`;
    return;
  }

  generatedNumbers = generateUniqueNumbers(quantity);
  renderNumbers(generatedNumbers);
  messageElement.textContent = `Сгенерировано: ${quantity.toLocaleString("ru-RU")}.`;
  messageElement.style.color = "#26734d";
});

quantityInput.addEventListener("input", () => {
  messageElement.textContent = "";
  messageElement.style.color = "";
});
