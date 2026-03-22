/**
 * Incident Zero — App Router & Event Bindings
 * SPA navigation, terminal input handling, exit confirmation.
 */

// ─── Navigation ───
function navigateTo(screenName) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active", "screen-fade-in"));
    const target = document.getElementById(`screen-${screenName}`);
    if (target) target.classList.add("active", "screen-fade-in");
    document.body.style.overflow = screenName === "settings" ? "auto" : "hidden";
}

function startScenario(scenarioId) {
    navigateTo("game");
    gameEngine.start(scenarioId);
}

function confirmExit() {
    console.log("confirmExit called, gameActive:", gameEngine.gameActive);
    if (gameEngine.gameActive) {
        if (confirm("⚠️ Active incident in progress! Are you sure you want to abort the mission?")) {
            gameEngine.gameActive = false;
            if (gameEngine.timerInterval) clearInterval(gameEngine.timerInterval);
            navigateTo("menu");
        }
    } else {
        navigateTo("menu");
    }
}

// ─── Terminal Input ───
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("terminal-input");
    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { const cmd = input.value; input.value = ""; gameEngine.processCommand(cmd); }
            if (e.key === "ArrowUp") { e.preventDefault(); input.value = gameEngine.navigateHistory("up"); }
            if (e.key === "ArrowDown") { e.preventDefault(); input.value = gameEngine.navigateHistory("down"); }
        });
    }

    document.getElementById("screen-game")?.addEventListener("click", (e) => {
        // Only focus terminal if clicking background, not buttons or interactive elements
        const isInteractive = e.target.closest("button") || e.target.closest("a") || e.target.closest("input");
        if (!isInteractive) input?.focus();
    });

    navigateTo("menu");
});

// ─── ESC key ───
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !(document.getElementById("screen-game")?.classList.contains("active") && gameEngine.gameActive)) {
        navigateTo("menu");
    }
});
