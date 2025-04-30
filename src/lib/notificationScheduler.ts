import cron from 'node-cron';

export function notificationScheduler() {

    cron.schedule('0 9 * * * *', () => {
        sendNotification('Time to log your morning activities')
    })

    cron.schedule('0 2 * * * *', () => {
        sendNotification('Time to log your afternoon activities')
    })

    cron.schedule('0 6 * * * *', () => {
        sendNotification('Time to log your evening activities')
    })

    cron.schedule('0 10 * * * *', () => {
        sendNotification('Time to log your night activities')
    })

}

function sendNotification(message: string) {

    new Notification(message)

}