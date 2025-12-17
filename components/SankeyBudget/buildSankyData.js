export function buildCategorizedSankey(rows, min = 50) {
  const nodes = [];
  const links = [];
  const index = new Map();

  const node = (name) => {
    if (!index.has(name)) {
      index.set(name, nodes.length);
      nodes.push({ name });
    }
    return index.get(name);
  };

  const income = node("Net Income");
  const budget = node("Budget");

  const expenses = rows.filter(r => r.amount < 0);

  const total = expenses.reduce((s, r) => s + Math.abs(r.amount), 0);

  links.push({
    source: income,
    target: budget,
    value: total
  });

  // Group → items
  const grouped = {};
  expenses.forEach(r => {
    grouped[r.group] ??= [];
    grouped[r.group].push(r);
  });

  Object.entries(grouped).forEach(([group, items]) => {
    const groupNode = node(group);

    const groupTotal = items.reduce(
      (s, r) => s + Math.abs(r.amount), 0
    );

    links.push({
      source: budget,
      target: groupNode,
      value: groupTotal
    });

    let otherTotal = 0;

    items.forEach(r => {
      const v = Math.abs(r.amount);

      if (v < min) {
        otherTotal += v;
      } else {
        links.push({
          source: groupNode,
          target: node(r.category),
          value: v
        });
      }
    });

    if (otherTotal > 0) {
      links.push({
        source: groupNode,
        target: node(`${group} – Other`),
        value: otherTotal
      });
    }
  });

  return { nodes, links };
}
