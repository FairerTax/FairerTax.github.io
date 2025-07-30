function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Your provided calculateWealthTax function, with the 100% rate corrected to 8%
function calculateWealthTax(netWorth) {
  if (netWorth < 0) {
    return 0.0; // No tax on negative net worth
  }

  // Tax brackets as per your latest specification
  const taxBrackets = [
    // [upperBound, rate]
    [1_000_000, 0.01], // 1% on $0 to $1M
    [10_000_000, 0.02], // 2% on $1M to $10M
    [100_000_000, 0.03], // 3% on $10M to $100M
    [1_000_000_000, 0.04], // 4% on $100M to $1B
    [10_000_000_000, 0.05], // 5% on $1B to $10B
    [100_000_000_000, 0.06], // 6% on $10B to $100B
    [1_000_000_000_000, 0.07], // 7% on $100B to $1T
    [Number.POSITIVE_INFINITY, 0.08], // 8% on over $1T (Corrected from 1.0)
  ];

  let totalTax = 0.0;
  let remainingNetWorth = netWorth;
  let currentBracketIndex = 0;
  let previousThreshold = 0.0;

  while (remainingNetWorth > 0 && currentBracketIndex < taxBrackets.length) {
    const [upperBound, rate] = taxBrackets[currentBracketIndex];
    // Calculate the amount of wealth that falls within the current bracket's range
    const amountInBracket = Math.min(
      remainingNetWorth,
      upperBound - previousThreshold
    );

    totalTax += amountInBracket * rate;
    remainingNetWorth -= amountInBracket;
    previousThreshold = upperBound; // Update threshold for the next iteration
    currentBracketIndex++;
  }

  return totalTax; // Return the calculated tax
}

// Get references to HTML elements
const netWorthInput = document.getElementById("netWorthInput");
const calculateBtn = document.getElementById("calculateBtn");
const displayElement = document.getElementById("displayWealthTax");

// Event listener for the button click
calculateBtn.addEventListener("click", () => {
  const netWorth = parseFloat(netWorthInput.value); // Get input and convert to number

  if (isNaN(netWorth)) {
    displayElement.textContent = "Please enter a valid number.";
    displayElement.classList.remove("text-blue-800");
    displayElement.classList.add("text-red-600");
    return;
  }

  // Calculate the tax
  const calculatedTax = calculateWealthTax(netWorth);

  // Display the formatted tax
  displayElement.textContent = formatCurrency(calculatedTax);
  displayElement.classList.remove("text-red-600");
  displayElement.classList.add("text-blue-800");
});
