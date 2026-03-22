/**
 * Incident Zero — Game Engine
 * Core game loop: scenario loading, terminal I/O, scoring, timer, SLA degradation.
 */

class GameEngine {
    constructor() {
        this.scenario = null;
        this.score = 0;
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.gameActive = false;
        this.rootCauseFound = false;
        this.commandHistory = [];
        this.correctCommands = 0;
        this.damagePoints = 0;
        this.historyIndex = -1;
    }

    start(scenarioId) {
        const scenario = SCENARIOS[scenarioId];
        if (!scenario) { console.error("Scenario not found:", scenarioId); return; }

        this.scenario = scenario;
        this.score = 0;
        this.timeRemaining = scenario.timeLimit;
        this.gameActive = true;
        this.rootCauseFound = false;
        this.commandHistory = [];
        this.correctCommands = 0;
        this.damagePoints = 0;
        this.historyIndex = -1;

        this.updateHeader();
        this.updateMetrics(scenario.initialState.metrics);
        this.updatePods(scenario.initialState.pods);
        this.updateSLA(scenario.initialState.sla);
        this.updateImpact(scenario.initialState.customersAffected);
        this.renderAlerts(scenario.initialState.alerts);

        const output = document.getElementById("terminal-output");
        output.innerHTML = "";
        this.printLine("Welcome to Incident Zero v0.1.0", "text-primary/60");
        this.printLine(`Scenario: ${scenario.title}`, "text-primary/60");
        this.printLine(scenario.description, "text-amber-400");
        this.printLine(`⏱️  Time limit: ${this.formatTime(scenario.timeLimit)}`, "text-on-surface-variant");
        this.printLine("Type 'help' for available commands.", "text-primary/60");
        this.printLine("─────────────────────────────────────────────────", "text-primary/40");

        this.startTimer();
        setTimeout(() => document.getElementById("terminal-input").focus(), 100);
    }

    processCommand(input) {
        if (!this.gameActive) return;
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        this.commandHistory.push(cmd);
        this.historyIndex = this.commandHistory.length;
        this.printLine(`root@ops:~$ ${input.trim()}`, "text-secondary");

        if (cmd === "clear") { document.getElementById("terminal-output").innerHTML = ""; return; }

        let commandDef = this.findCommand(cmd);
        if (!commandDef) {
            this.printLine(`bash: ${cmd.split(" ")[0]}: command not found`, "text-error");
            this.printLine("Type 'help' for available commands.", "text-on-surface-variant/50");
            return;
        }
        if (commandDef.aliasOf) commandDef = this.scenario.commands[commandDef.aliasOf];

        if (commandDef.output) commandDef.output.forEach(line => this.printHTML(this.parseAnsiColors(line)));

        if (commandDef.points) {
            this.score += commandDef.points;
            if (commandDef.points > 0) { this.correctCommands++; this.printLine(`  📊 +${commandDef.points} points`, "text-secondary text-xs opacity-70"); }
            else { this.damagePoints += Math.abs(commandDef.points); this.printLine(`  📊 ${commandDef.points} points`, "text-error text-xs opacity-70"); }
            this.updateScore();
        }

        if (commandDef.revealsRootCause) this.rootCauseFound = true;
        if (commandDef.hint) this.printLine(`  💡 ${commandDef.hint}`, "text-amber-400 text-xs italic");
        if (commandDef.addAlert) this.addAlert(commandDef.addAlert);
        if (commandDef.metricsUpdate) this.updateMetrics(commandDef.metricsUpdate);
        if (commandDef.podUpdate) this.updatePods(commandDef.podUpdate);
        if (commandDef.slaImpact) { const s = parseFloat(document.getElementById("sla-value").textContent); this.updateSLA(Math.max(0, s + commandDef.slaImpact)); }
        if (commandDef.slaBoost) { const s = parseFloat(document.getElementById("sla-value").textContent); this.updateSLA(Math.min(100, s + commandDef.slaBoost)); }
        if (commandDef.gameOver) { this.endGame(false); return; }
        if (commandDef.isSolution) { setTimeout(() => this.endGame(true), 1500); }

        this.printLine("");
        document.getElementById("terminal-output").scrollTop = document.getElementById("terminal-output").scrollHeight;
    }

    findCommand(input) {
        const cmds = this.scenario.commands;
        if (cmds[input]) return cmds[input];
        for (const [pattern, def] of Object.entries(cmds)) {
            if (input.includes(pattern) || pattern.includes(input)) return def;
            const base = pattern.replace(/\*/g, "");
            if ((input.startsWith(base) || base.startsWith(input)) && input.length >= base.length * 0.7) return def;
        }
        return null;
    }

    parseAnsiColors(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/\x1b\[31m(.*?)\x1b\[0m/g, '<span class="text-error font-bold">$1</span>')
            .replace(/\x1b\[32m(.*?)\x1b\[0m/g, '<span class="text-secondary font-bold">$1</span>')
            .replace(/\x1b\[33m(.*?)\x1b\[0m/g, '<span class="text-amber-400 font-bold">$1</span>');
    }

    printLine(text, classes = "") {
        const output = document.getElementById("terminal-output");
        const p = document.createElement("p");
        p.className = `terminal-glow ${classes}`;
        p.textContent = text;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }

    printHTML(html) {
        const output = document.getElementById("terminal-output");
        const p = document.createElement("p");
        p.className = "terminal-glow";
        p.innerHTML = html;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }

    // ─── UI Updates ───
    updateHeader() {
        document.getElementById("game-mission-name").textContent = this.scenario.missionName;
        document.getElementById("game-objective").textContent = this.scenario.objective;
        this.updateScore();
    }

    updateScore() { document.getElementById("game-score").textContent = Math.max(0, this.score).toLocaleString(); }

    updateMetrics(m) {
        const set = (id, val) => {
            const valEl = document.getElementById(`metric-${id}-val`);
            const barEl = document.getElementById(`metric-${id}-bar`);
            if (valEl) valEl.textContent = val + "%";
            if (barEl) barEl.style.width = val + "%";
            if (valEl) {
                if (val >= 90) { valEl.className = "text-error"; barEl.className = "h-full bg-error shadow-[0_0_8px_#ff716c] transition-all duration-500"; }
                else if (val >= 70) { valEl.className = "text-amber-400"; barEl.className = "h-full bg-amber-400 shadow-[0_0_8px_#ffaa00] transition-all duration-500"; }
                else { valEl.className = "text-secondary"; barEl.className = "h-full bg-secondary shadow-[0_0_8px_#00fd87] transition-all duration-500"; }
            }
        };
        set("cpu", m.cpu); set("mem", m.memory); set("disk", m.disk); set("net", m.network);
    }

    updatePods(p) {
        document.getElementById("pod-status-text").innerHTML = `${p.running}/${p.total} <span class="w-2 h-2 rounded-full ${p.running === p.total ? 'bg-secondary shadow-[0_0_4px_#00fd87]' : 'bg-error shadow-[0_0_4px_#ff716c]'}"></span>`;
    }

    updateSLA(val) { document.getElementById("sla-value").textContent = val.toFixed(1) + "%"; document.getElementById("sla-bar").style.width = val + "%"; }
    updateImpact(count) { document.getElementById("impact-text").textContent = `👥 ${count.toLocaleString()} AFFECTED`; }

    renderAlerts(alerts) { const panel = document.getElementById("alerts-panel"); panel.innerHTML = ""; alerts.forEach(a => this.addAlertElement(a)); }
    addAlert(alert) { this.addAlertElement(alert, true); }

    addAlertElement(a, prepend = false) {
        const panel = document.getElementById("alerts-panel");
        const colors = {
            critical: { border: "border-error", badge: "text-error bg-error/10", text: "CRITICAL" },
            warning:  { border: "border-amber-400", badge: "text-amber-400 bg-amber-400/10", text: "WARNING" },
            info:     { border: "border-primary", badge: "text-primary bg-primary/10", text: "INFO" },
            system:   { border: "border-secondary", badge: "text-secondary bg-secondary/10", text: "SYSTEM" }
        };
        const c = colors[a.severity] || colors.info;
        const div = document.createElement("div");
        div.className = `bg-surface-container-high border-l-4 ${c.border} p-4 shadow-lg hover:bg-surface-bright transition-colors alert-enter`;
        div.innerHTML = `<div class="flex justify-between items-start mb-1"><span class="text-[10px] font-bold ${c.badge} px-2 py-0.5">${c.text}</span><span class="text-[9px] text-on-surface-variant font-mono">${a.time}</span></div><h4 class="text-xs font-bold text-on-surface leading-tight">${a.title}</h4><p class="text-[10px] text-on-surface-variant mt-2 font-mono">${a.detail}</p>`;
        if (prepend) panel.insertBefore(div, panel.firstChild); else panel.appendChild(div);
    }

    // ─── Timer ───
    startTimer() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            if (!this.gameActive) return;
            this.timeRemaining--;
            this.updateTimerDisplay();
            if (this.timeRemaining % 10 === 0) { const s = parseFloat(document.getElementById("sla-value").textContent); if (s > 50) this.updateSLA(s - 0.3); }
            if (this.timeRemaining <= 0) this.endGame(false);
        }, 1000);
    }

    updateTimerDisplay() { document.getElementById("game-timer").textContent = this.formatTime(this.timeRemaining); }
    formatTime(s) { return `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`; }

    // ─── End Game ───
    endGame(success) {
        this.gameActive = false;
        clearInterval(this.timerInterval);

        const timeUsed = this.scenario.timeLimit - this.timeRemaining;
        const timePercent = timeUsed / this.scenario.timeLimit;
        let speedBonus = 0;
        if (success) { speedBonus = timePercent < 0.5 ? this.scenario.scoring.speedBonus.underHalf : timePercent < 0.75 ? this.scenario.scoring.speedBonus.underThreeQuarter : 0; }
        const rcaBonus = this.rootCauseFound ? this.scenario.scoring.rootCauseBonus : 0;
        const totalScore = Math.max(0, this.score + speedBonus + rcaBonus);

        let stars = 0;
        for (const s of this.scenario.scoring.stars) { if (totalScore >= s.threshold) { stars = s.stars; break; } }
        let grade = "F", rank = "Dismissed";
        for (const g of this.scenario.scoring.grades) { if (totalScore >= g.threshold) { grade = g.grade; rank = g.rank; break; } }

        document.getElementById("score-title").textContent = success ? "🎉 INCIDENT RESOLVED!" : "💀 MISSION FAILED";
        document.getElementById("score-title").className = success
            ? "font-headline font-bold text-4xl md:text-6xl tracking-tighter text-[#ffaa00] glow-text-gold uppercase mb-2"
            : "font-headline font-bold text-4xl md:text-6xl tracking-tighter text-error error-glow uppercase mb-2";

        document.getElementById("score-scenario-name").textContent = this.scenario.title;
        document.getElementById("score-difficulty").textContent = `⭐ ${this.scenario.difficulty}`;
        document.getElementById("score-time").textContent = this.formatTime(timeUsed);
        document.getElementById("score-time-limit").textContent = `/ ${this.formatTime(this.scenario.timeLimit)}`;

        const circumference = 364.4;
        document.getElementById("score-timer-ring").setAttribute("stroke-dashoffset", circumference * (1 - (timeUsed / this.scenario.timeLimit)));

        const starsEl = document.getElementById("score-stars");
        starsEl.innerHTML = [1, 2, 3].map(i => `<span class="material-symbols-outlined text-4xl ${i <= stars ? 'text-[#ffaa00] glow-text-gold' : 'text-on-surface-variant/30'}" style="font-variation-settings: 'FILL' ${i <= stars ? 1 : 0};">star</span>`).join("");

        document.getElementById("score-correct").textContent = `+${Math.max(0, this.score)} PTS`;
        document.getElementById("score-speed").textContent = `+${speedBonus} PTS`;
        document.getElementById("score-rca").textContent = `+${rcaBonus} PTS`;
        document.getElementById("score-damage").textContent = `-${this.damagePoints} PTS`;
        document.getElementById("score-total").textContent = `${totalScore} PTS`;
        document.getElementById("score-grade").textContent = grade;
        document.getElementById("score-rank").textContent = rank;

        navigateTo("score");
    }

    navigateHistory(direction) {
        if (!this.commandHistory.length) return "";
        if (direction === "up") this.historyIndex = Math.max(0, this.historyIndex - 1);
        else this.historyIndex = Math.min(this.commandHistory.length, this.historyIndex + 1);
        return this.commandHistory[this.historyIndex] || "";
    }
}

const gameEngine = new GameEngine();
