/**
 * Incident Zero — Scenario Data
 * Community edition scenarios with command mappings, scoring, and hints.
 */

const SCENARIOS = {
    pod_crash: {
        id: "pod_crash",
        title: "Pod CrashLoopBackOff",
        missionName: "Mission: Payment Service Down",
        difficulty: "EASY",
        edition: "community",
        timeLimit: 600,
        description: "Payment servisi CrashLoopBackOff'a girdi. Müşteriler ödeme yapamıyor.",
        objective: "Restore payment-svc within SLA deadline",
        initialState: {
            metrics: { cpu: 82, memory: 64, disk: 94, network: 38 },
            pods: { running: 12, total: 15 },
            sla: 78.2,
            customersAffected: 1247,
            alerts: [
                { severity: "critical", title: "payment-svc CrashLoopBackOff", detail: "Namespace: production-bank", time: "5m ago" },
                { severity: "warning",  title: "Disk /var/lib usage at 94%",   detail: "Host: node-cluster-02",     time: "12m ago" },
                { severity: "info",     title: "HPA scaling triggered for api-gw", detail: "Replicas: 3 → 5",      time: "18m ago" }
            ]
        },
        rootCause: "OOMKilled - Memory limit 256Mi çok düşük ayarlanmış",
        commands: {
            "help": {
                output: ["Available commands:","  kubectl get pods [-n namespace]","  kubectl describe pod <name>","  kubectl logs <pod> [--tail=N]","  kubectl rollout restart deploy/<n>","  kubectl scale deploy/<n> --replicas=N","  kubectl edit deploy/<n>","  kubectl delete pod <name> [--force]","  kubectl get events","  kubectl top pods","  df -h","  clear","","  hint  — Get a hint 💡"],
                points: 0
            },
            "kubectl get pods": {
                output: ["NAME                          READY   STATUS             RESTARTS   AGE","api-gw-7f4d8b-x2k9l          1/1     Running            0          14h","\x1b[31mpayment-svc-6x9y3-m4n7p      0/1     CrashLoopBackOff   24         5m\x1b[0m","auth-mod-2k1p5-r8s6t          1/1     Running            1          2d","db-proxy-9m0l2-v5w3x          1/1     Running            0          6h","core-bank-3j7h1-q9a4b         1/1     Running            0          2d","mobile-api-8c2f6-y1z0d        1/1     Running            2          1d"],
                points: 10, hint: "İlk adım doğru! Şimdi çöken pod'u daha detaylı incele."
            },
            "kubectl get pods -n banking-core": { aliasOf: "kubectl get pods" },
            "kubectl describe pod payment-svc": {
                output: ["Name:         payment-svc-6x9y3-m4n7p","Namespace:    banking-core","Node:         node-cluster-02/10.0.1.15","Status:       Running","Containers:","  payment-app:","    Image:          registry.bank.local/payment-svc:v2.3.1","    State:          Waiting (CrashLoopBackOff)","    Last State:     Terminated","      Reason:       \x1b[31mOOMKilled\x1b[0m","      Exit Code:    137","    Resources:","      Limits:","        memory:  \x1b[31m256Mi\x1b[0m","        cpu:     200m","      Requests:","        memory:  128Mi","        cpu:     100m","Events:","  Warning  OOMKilling   5m   kubelet  Container payment-app exceeded memory limit (256Mi)","  Warning  BackOff      3m   kubelet  Back-off restarting failed container"],
                points: 20, revealsRootCause: true,
                hint: "Root cause bulundu! Memory limit 256Mi çok düşük. Deployment'ı edit et.",
                addAlert: { severity: "info", title: "Root cause identified: OOMKilled", detail: "Memory limit: 256Mi", time: "now" }
            },
            "kubectl logs payment-svc": {
                output: ["2024-03-22T16:42:01Z INFO  Starting payment-svc v2.3.1...","2024-03-22T16:42:01Z INFO  Connecting to database...","2024-03-22T16:42:02Z INFO  Database connected.","2024-03-22T16:42:02Z INFO  Loading transaction cache...","2024-03-22T16:42:03Z WARN  Cache memory allocation growing: 180Mi / 256Mi","2024-03-22T16:42:04Z ERROR Cache memory allocation exceeded: 260Mi / 256Mi","\x1b[31mpanic: runtime error: out of memory\x1b[0m","[signal SIGKILL: kill]","","goroutine 42 [running]:","main.handlePayment(...)","  /src/main.go:124"],
                points: 15, hint: "Log'lar memory sorununu gösteriyor. Describe ile detayları doğrula."
            },
            "kubectl logs payment-svc --tail=50": { aliasOf: "kubectl logs payment-svc" },
            "kubectl top pods": {
                output: ["NAME                          CPU(cores)   MEMORY(bytes)","api-gw-7f4d8b-x2k9l          45m          120Mi","payment-svc-6x9y3-m4n7p       180m         256Mi ⚠️ LIMIT","auth-mod-2k1p5-r8s6t          20m          90Mi","db-proxy-9m0l2-v5w3x          60m          200Mi","core-bank-3j7h1-q9a4b         30m          150Mi","mobile-api-8c2f6-y1z0d        25m          80Mi"],
                points: 10
            },
            "kubectl get events": {
                output: ["LAST SEEN   TYPE      REASON           OBJECT                        MESSAGE","5m          Warning   OOMKilling       pod/payment-svc-6x9y3-m4n7p   Container exceeded memory limit","5m          Warning   BackOff          pod/payment-svc-6x9y3-m4n7p   Back-off restarting failed container","12m         Warning   DiskPressure     node/node-cluster-02          Disk usage above 90%","18m         Normal    ScalingUp        deploy/api-gw                 Scaled up to 5 replicas"],
                points: 10
            },
            "kubectl edit deployment/payment-svc": {
                output: ["# Editing deployment/payment-svc...","# ✅ Memory limit updated: 256Mi → 512Mi","# ✅ Memory request updated: 128Mi → 256Mi","","deployment.apps/payment-svc edited","","Waiting for rollout...","  pod/payment-svc-6x9y3-m4n7p   Terminating","  pod/payment-svc-8a3b2-k7j5n   Running ✅","","\x1b[32m✅ payment-svc is now Running with updated memory limits.\x1b[0m","\x1b[32m🎉 INCIDENT RESOLVED! Payment service restored.\x1b[0m"],
                points: 30, isSolution: true,
                addAlert: { severity: "system", title: "payment-svc restored to Running", detail: "Memory: 512Mi", time: "now" },
                metricsUpdate: { cpu: 45, memory: 52, disk: 88, network: 42 },
                podUpdate: { running: 15, total: 15 }, slaBoost: 21.8
            },
            "kubectl edit deploy/payment-svc": { aliasOf: "kubectl edit deployment/payment-svc" },
            "kubectl rollout restart deployment/payment-svc": {
                output: ["deployment.apps/payment-svc restarted","","Waiting for rollout...","  pod/payment-svc-6x9y3-m4n7p   Terminating","  pod/payment-svc-9z2x1-h6g4f   ContainerCreating","  pod/payment-svc-9z2x1-h6g4f   Running","","⚠️  Pod restarted but crashed again after 30 seconds.","\x1b[31m   Status: CrashLoopBackOff (OOMKilled)\x1b[0m","   Root cause not addressed. Memory limit still 256Mi."],
                points: -10, hint: "Restart çözmedi çünkü memory limit hala düşük. 'kubectl edit' ile limit'i artır.",
                addAlert: { severity: "warning", title: "payment-svc restarted but still crashing", detail: "OOMKilled persists", time: "now" }
            },
            "kubectl rollout restart deploy/payment-svc": { aliasOf: "kubectl rollout restart deployment/payment-svc" },
            "kubectl delete pod payment-svc": {
                output: ["pod \"payment-svc-6x9y3-m4n7p\" deleted","","⚠️  Pod deleted. ReplicaSet created a new pod.","  pod/payment-svc-7b5c3-n9m1k   CrashLoopBackOff","","\x1b[31m  Same OOMKilled error. Deleting the pod doesn't fix the root cause.\x1b[0m"],
                points: -20, hint: "Pod silmek sorunu çözmez. Deployment'taki memory limit'i düzelt.", slaImpact: -5
            },
            "kubectl delete pod payment-svc --force": { aliasOf: "kubectl delete pod payment-svc" },
            "kubectl scale deployment/payment-svc --replicas=3": {
                output: ["deployment.apps/payment-svc scaled","","⚠️  Scaling to 3 replicas...","  pod/payment-svc-6x9y3-m4n7p   CrashLoopBackOff","  pod/payment-svc-a1b2c-d3e4f    CrashLoopBackOff","  pod/payment-svc-g5h6i-j7k8l    CrashLoopBackOff","","\x1b[31m  All 3 replicas are OOMKilled. More pods = more failed pods.\x1b[0m"],
                points: -15, hint: "Scaling doesn't help when all pods crash for the same reason."
            },
            "kubectl delete namespace banking-core": {
                output: ["\x1b[31m⚠️⚠️⚠️  CATASTROPHIC ERROR  ⚠️⚠️⚠️\x1b[0m","","namespace \"banking-core\" deleted","","\x1b[31m  ALL SERVICES IN banking-core HAVE BEEN DESTROYED!\x1b[0m","  ❌ payment-svc — DELETED","  ❌ auth-mod — DELETED","  ❌ core-bank — DELETED","  ❌ db-proxy — DELETED","  ❌ mobile-api — DELETED","  ❌ api-gw — DELETED","","\x1b[31m  💀 GAME OVER — You deleted the entire production namespace.\x1b[0m"],
                points: -500, gameOver: true, slaImpact: -100
            },
            "df -h": {
                output: ["Filesystem      Size  Used  Avail  Use%  Mounted on","/dev/sda1       100G   94G    6G    94%   /var/lib/containers","/dev/sdb1        50G   12G   38G    24%   /var/log","tmpfs            8G  1.2G  6.8G    15%   /tmp"],
                points: 5
            },
            "hint": {
                output: ["💡 HINT:","  1. Start by listing pods: kubectl get pods","  2. Check why the pod is crashing: kubectl describe pod payment-svc","  3. Look at the logs: kubectl logs payment-svc","  4. Fix the root cause (usually with kubectl edit deploy/payment-svc)","","  Remember: deleting or restarting pods won't fix configuration issues!"],
                points: -5
            }
        },
        scoring: {
            stars: [{ threshold: 100, stars: 3 },{ threshold: 50, stars: 2 },{ threshold: 1, stars: 1 }],
            grades: [{ threshold: 120, grade: "S", rank: "Staff SRE" },{ threshold: 100, grade: "A", rank: "Senior SRE" },{ threshold: 70, grade: "B", rank: "SRE" },{ threshold: 40, grade: "C", rank: "Junior SRE" },{ threshold: 0, grade: "D", rank: "Intern" }],
            speedBonus: { underHalf: 30, underThreeQuarter: 15 },
            rootCauseBonus: 40
        }
    },

    pvc_full: {
        id: "pvc_full",
        title: "PVC Disk Full",
        missionName: "Mission: Disk Emergency",
        difficulty: "EASY",
        edition: "community",
        timeLimit: 720,
        description: "Log partition doldu. Tüm servisler log yazamıyor.",
        objective: "Free disk space on /var/lib/containers below 80%",
        initialState: {
            metrics: { cpu: 45, memory: 52, disk: 98, network: 22 },
            pods: { running: 14, total: 15 },
            sla: 92.1,
            customersAffected: 340,
            alerts: [
                { severity: "critical", title: "DiskPressure on node-cluster-02", detail: "/var/lib at 98%", time: "2m ago" },
                { severity: "warning",  title: "Pod eviction imminent",          detail: "1 pod will be evicted", time: "3m ago" },
                { severity: "info",     title: "Cleanup cronjob failed",         detail: "No space left on device", time: "10m ago" }
            ]
        },
        rootCause: "Eski log dosyaları temizlenmemiş, /var/lib/containers %98 dolu",
        commands: {
            "help": {
                output: ["Available commands:","  kubectl get pods","  kubectl describe node <name>","  kubectl logs <pod>","  df -h","  du -sh /var/log/*","  ls -lh /var/lib/containers/logs/","  rm -rf /var/lib/containers/logs/old/","  kubectl get pvc","  clear","  hint"],
                points: 0
            },
            "kubectl get pods": {
                output: ["NAME                          READY   STATUS    RESTARTS   AGE","api-gw-7f4d8b-x2k9l          1/1     Running   0          14h","payment-svc-6x9y3-m4n7p      1/1     Running   0          2d","auth-mod-2k1p5-r8s6t          1/1     Running   0          2d","db-proxy-9m0l2-v5w3x          1/1     Running   0          6h","\x1b[33mlog-collector-4k8j2-b3c1d    0/1     Evicted   0          30m\x1b[0m","core-bank-3j7h1-q9a4b         1/1     Running   0          2d"],
                points: 10
            },
            "df -h": {
                output: ["Filesystem      Size  Used  Avail  Use%  Mounted on","\x1b[31m/dev/sda1       100G   98G    2G    98%   /var/lib/containers\x1b[0m","/dev/sdb1        50G   12G   38G    24%   /var/log","tmpfs            8G  1.2G  6.8G    15%   /tmp"],
                points: 10, hint: "/var/lib/containers neredeyse tamamen dolu. Neyin yer kapladığını bul."
            },
            "du -sh /var/log/*": {
                output: ["12G    /var/log/containers","800M   /var/log/pods","2.1G   /var/log/journal","\x1b[31m45G    /var/log/old-backups\x1b[0m","500M   /var/log/audit"],
                points: 15, revealsRootCause: true, hint: "45GB'lık eski backup dosyaları bulundu! Bunları sil."
            },
            "ls -lh /var/lib/containers/logs/": {
                output: ["total 52G","-rw-r--r-- 1 root root  2.1G Mar 20 app-2024-03-20.log","-rw-r--r-- 1 root root  1.8G Mar 21 app-2024-03-21.log","-rw-r--r-- 1 root root  3.2G Mar 22 app-2024-03-22.log","\x1b[31mdrwxr-xr-x 2 root root  45G  Mar 15 old-backups/\x1b[0m"],
                points: 10
            },
            "rm -rf /var/log/old-backups": {
                output: ["Removing /var/log/old-backups...","✅ 45GB freed.","","Current disk usage:","  /dev/sda1: 53G / 100G (53%) ✅","","\x1b[32m🎉 INCIDENT RESOLVED! Disk pressure cleared.\x1b[0m"],
                points: 30, isSolution: true,
                metricsUpdate: { cpu: 40, memory: 48, disk: 53, network: 22 },
                podUpdate: { running: 15, total: 15 }, slaBoost: 7.9
            },
            "rm -rf /var/lib/containers/logs/old/": { aliasOf: "rm -rf /var/log/old-backups" },
            "hint": {
                output: ["💡 HINT:","  1. Check disk usage: df -h","  2. Find what's using space: du -sh /var/log/*","  3. Delete unnecessary files: rm -rf /var/log/old-backups"],
                points: -5
            }
        },
        scoring: {
            stars: [{ threshold: 80, stars: 3 },{ threshold: 40, stars: 2 },{ threshold: 1, stars: 1 }],
            grades: [{ threshold: 100, grade: "S", rank: "Staff SRE" },{ threshold: 80, grade: "A", rank: "Senior SRE" },{ threshold: 50, grade: "B", rank: "SRE" },{ threshold: 25, grade: "C", rank: "Junior SRE" },{ threshold: 0, grade: "D", rank: "Intern" }],
            speedBonus: { underHalf: 25, underThreeQuarter: 10 },
            rootCauseBonus: 35
        }
    }
};
