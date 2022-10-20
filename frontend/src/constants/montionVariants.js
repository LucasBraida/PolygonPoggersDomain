const containerVariant = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 2
        }
    }
}

const itemVariant = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
}

export {containerVariant, itemVariant}
