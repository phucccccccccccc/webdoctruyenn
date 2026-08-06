function prevent(e) {
    e.preventDefault();
}

function handleKeyDown(e) {

    const key = e.key.toLowerCase();

    if (e.ctrlKey && ["c", "x", "s", "u", "p"].includes(key)) {
        e.preventDefault();
    }

    if (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) {
        e.preventDefault();
    }

    if (e.key === "F12") {
        e.preventDefault();
    }
}

export function antiCopy() {
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("keydown", handleKeyDown);
}

export function removeAntiCopy() {
    document.removeEventListener("contextmenu", prevent);
    document.removeEventListener("copy", prevent);
    document.removeEventListener("cut", prevent);
    document.removeEventListener("dragstart", prevent);
    document.removeEventListener("keydown", handleKeyDown);
}