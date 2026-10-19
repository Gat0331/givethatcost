const ingredientRows = document.getElementById('ingredient-rows');
const batchYieldInput = document.getElementById('batch-yield');
const sellingPriceInput = document.getElementById('selling-price');
const batchTotalOutput = document.getElementById('batch-total');
const ingredientStatus = document.getElementById('ingredient-status');
const calculationMessage = document.getElementById('calculation-message');

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const sampleIngredients = [
  { name: 'Bread flour', quantity: '1.2', unit: 'kg', cost: '2.40' },
  { name: 'Unsalted butter', quantity: '0.25', unit: 'kg', cost: '8.80' },
  { name: 'Brown sugar', quantity: '0.18', unit: 'kg', cost: '3.60' },
  { name: 'Eggs', quantity: '3', unit: 'each', cost: '0.38' }
];

function formatMoney(value) {
  return currency.format(value);
}

function createField(type, label, value, extra = {}) {
  const input = document.createElement('input');
  input.type = type;
  input.setAttribute('aria-label', label);
  input.value = value;
  if (type === 'number') {
    input.min = '0';
    input.step = extra.step || '0.01';
    input.inputMode = extra.inputMode || 'decimal';
  } else {
    input.maxLength = 60;
  }
  input.addEventListener('input', updateCalculations);
  return input;
}

function appendCell(row, content, className) {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  if (content instanceof Node) cell.appendChild(content);
  else cell.textContent = content;
  row.appendChild(cell);
  return cell;
}

function addIngredient(ingredient = { name: '', quantity: '', unit: 'kg', cost: '' }, focusName = false) {
  const row = document.createElement('tr');
  row.className = 'ingredient-row';

  const nameInput = createField('text', 'Ingredient name', ingredient.name);
  nameInput.className = 'ingredient-name';
  appendCell(row, nameInput);

  const accessibleName = ingredient.name.trim() || 'Ingredient';
  const quantityInput = createField('number', `${accessibleName} amount`, ingredient.quantity, { step: 'any' });
  quantityInput.className = 'ingredient-quantity';
  appendCell(row, quantityInput);

  const unitSelect = document.createElement('select');
  unitSelect.setAttribute('aria-label', `${accessibleName} unit`);
  unitSelect.className = 'ingredient-unit';
  [
    ['kg', 'kg'],
    ['g', 'g'],
    ['l', 'L'],
    ['ml', 'mL'],
    ['each', 'each']
  ].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    unitSelect.appendChild(option);
  });
  unitSelect.value = ingredient.unit;
  unitSelect.addEventListener('change', updateCalculations);
  appendCell(row, unitSelect);

  const costInput = createField('number', `${accessibleName} cost per unit in dollars`, ingredient.cost, { step: 'any' });
  costInput.className = 'ingredient-cost';
  appendCell(row, costInput);

  const lineCell = appendCell(row, '—', 'ingredient-line-total');
  lineCell.setAttribute('aria-label', 'Ingredient line total');

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-ingredient';
  removeButton.setAttribute('aria-label', `Remove ${accessibleName}`);
  removeButton.textContent = '×';
  removeButton.addEventListener('click', () => {
    row.remove();
    updateCalculations();
  });
  appendCell(row, removeButton, 'remove-cell');

  ingredientRows.appendChild(row);
  nameInput.addEventListener('input', () => {
    const currentName = nameInput.value.trim() || 'Ingredient';
    quantityInput.setAttribute('aria-label', `${currentName} amount`);
    unitSelect.setAttribute('aria-label', `${currentName} unit`);
    costInput.setAttribute('aria-label', `${currentName} cost per unit in dollars`);
    removeButton.setAttribute('aria-label', `Remove ${currentName}`);
  });
  updateCalculations();
  if (focusName) nameInput.focus();
}

function getNumber(input) {
  const raw = input.value.trim();
  if (raw === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function updateCalculations() {
  let totalCost = 0;
  let incompleteRows = 0;

  Array.from(ingredientRows.rows).forEach((row) => {
    const name = row.querySelector('.ingredient-name').value.trim();
    const quantity = getNumber(row.querySelector('.ingredient-quantity'));
    const unitCost = getNumber(row.querySelector('.ingredient-cost'));
    const lineCell = row.querySelector('.ingredient-line-total');
    const isComplete = name !== '' && quantity !== null && quantity > 0 && unitCost !== null;

    if (isComplete) {
      const lineTotal = quantity * unitCost;
      totalCost += lineTotal;
      lineCell.textContent = formatMoney(lineTotal);
      lineCell.dataset.valid = 'true';
    } else {
      lineCell.textContent = '—';
      lineCell.dataset.valid = 'false';
      incompleteRows += 1;
    }
  });

  batchTotalOutput.textContent = formatMoney(totalCost);
  const rowCount = ingredientRows.rows.length;
  ingredientStatus.textContent = rowCount === 0
    ? 'Add an ingredient to calculate your batch cost.'
    : incompleteRows
      ? `${incompleteRows} ingredient ${incompleteRows === 1 ? 'row needs' : 'rows need'} a name, amount above zero, and a unit cost.`
      : '';

  const yieldValue = getNumber(batchYieldInput);
  const price = getNumber(sellingPriceInput);
  const rowsAreComplete = rowCount > 0 && incompleteRows === 0;
  const hasYield = yieldValue !== null && Number.isInteger(yieldValue) && yieldValue > 0;
  const hasPrice = price !== null;
  const results = {
    'profit-per-item': null,
    'profit-per-batch': null,
    'cost-per-item': null,
    'batch-revenue': null,
    'gross-margin': null
  };

  if (rowCount === 0) {
    calculationMessage.textContent = 'Add at least one ingredient to see your batch estimate.';
  } else if (!rowsAreComplete) {
    calculationMessage.textContent = 'Complete or remove unfinished ingredient rows to see your batch estimate.';
  } else if (!hasYield) {
    calculationMessage.textContent = 'Enter a whole-number yield of at least 1 item to calculate per-item costs and profit.';
  } else if (!hasPrice) {
    calculationMessage.textContent = 'Enter a valid selling price of $0 or more to calculate revenue and profit.';
  } else {
    const costPerItem = totalCost / yieldValue;
    const revenue = price * yieldValue;
    const profitPerItem = price - costPerItem;
    const batchProfit = revenue - totalCost;
    const grossMargin = revenue > 0 ? (batchProfit / revenue) * 100 : null;

    results['profit-per-item'] = formatMoney(profitPerItem);
    results['profit-per-batch'] = formatMoney(batchProfit);
    results['cost-per-item'] = formatMoney(costPerItem);
    results['batch-revenue'] = formatMoney(revenue);
    results['gross-margin'] = grossMargin === null ? '—' : `${grossMargin.toFixed(1)}%`;
    calculationMessage.textContent = revenue === 0
      ? 'At a $0.00 selling price, expected revenue is $0.00; gross margin is not defined.'
      : '';
  }

  Object.entries(results).forEach(([id, value]) => {
    const output = document.getElementById(id);
    output.textContent = value === null ? '—' : value;
    output.classList.toggle('is-negative', value !== null && Number(value.replace(/[^0-9.-]/g, '')) < 0);
  });
}

document.getElementById('add-ingredient').addEventListener('click', () => addIngredient(undefined, true));
batchYieldInput.addEventListener('input', updateCalculations);
sellingPriceInput.addEventListener('input', updateCalculations);

sampleIngredients.forEach((ingredient) => addIngredient(ingredient));
