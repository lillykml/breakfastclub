const generateId = (brunches) => {
    const maxId = brunches.length > 0
      ? Math.max(...brunches.map(n => n.id))
      : 0
    return maxId + 1
}

module.exports = {generateId}