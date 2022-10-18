const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 2
        }
    }
}

const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
}

export {container, item}