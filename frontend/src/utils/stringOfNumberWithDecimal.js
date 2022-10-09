export const stringOfNumberWithDecimal = (value, numberOfDecimals) => {
    console.log("fV value: ", value)
    const valueNum = (parseFloat(value) / 10**numberOfDecimals).toFixed(numberOfDecimals)
    console.log("fV numValue: ", valueNum)
    if (value === "") {
        return 0
    } else {
        if (valueNum <= 0) {
            return 0
        } else {
            return valueNum
        }
    }
}