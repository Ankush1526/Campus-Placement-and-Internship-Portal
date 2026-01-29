// Notification Service for Application Status Updates

export interface ApplicationNotification {
    id: number;
    companyName: string;
    position: string;
    status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted';
    timestamp: string;
    read: boolean;
    message: string;
}

export class NotificationService {
    private static instance: NotificationService;
    private notifications: ApplicationNotification[] = [];

    private constructor() {
        this.loadNotifications();
    }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private loadNotifications(): void {
        try {
            const stored = localStorage.getItem('applicationNotifications');
            this.notifications = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications = [];
        }
    }

    private saveNotifications(): void {
        try {
            localStorage.setItem('applicationNotifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    public addNotification(notification: Omit<ApplicationNotification, 'id' | 'read'>): void {
        const newNotification: ApplicationNotification = {
            ...notification,
            id: Date.now(),
            read: false
        };

        this.notifications.unshift(newNotification);
        this.saveNotifications();
        
        // Show browser notification if supported
        this.showBrowserNotification(newNotification);
    }

    public getNotifications(): ApplicationNotification[] {
        return this.notifications;
    }

    public markAsRead(notificationId: number): void {
        this.notifications = this.notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
        );
        this.saveNotifications();
    }

    public deleteNotification(notificationId: number): void {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
    }

    public getUnreadCount(): number {
        return this.notifications.filter(n => !n.read).length;
    }

    public clearAll(): void {
        this.notifications = [];
        this.saveNotifications();
    }

    private showBrowserNotification(notification: ApplicationNotification): void {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Application Status Update', {
                body: `${notification.companyName} - ${notification.position}: ${notification.status.replace('_', ' ')}`,
                icon: '/favicon.ico',
                tag: notification.id.toString()
            });
        }
    }

    public requestNotificationPermission(): void {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // Simulate status updates for demo purposes
    public simulateStatusUpdates(): void {
        const companies = [
            { name: 'TechGlobal Inc.', position: 'Full Stack Developer' },
            { name: 'FinanceCore', position: 'Financial Analyst' },
            { name: 'TechCorp Solutions', position: 'Software Development Intern' },
            { name: 'DesignStudio Pro', position: 'UI/UX Designer' },
            { name: 'DataTech Solutions', position: 'Data Scientist' }
        ];

        const statuses: Array<'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'accepted'> = [
            'pending', 'under_review', 'shortlisted', 'rejected', 'accepted'
        ];

        const messages = {
            pending: 'Your application has been received and is being reviewed.',
            under_review: 'Your application is currently under review by our team.',
            shortlisted: 'Congratulations! You have been shortlisted for the next round.',
            rejected: 'Thank you for your interest. We regret to inform you that your application was not selected.',
            accepted: 'Congratulations! Your application has been accepted. Welcome to the team!'
        };

        // Generate random status updates
        setInterval(() => {
            const randomCompany = companies[Math.floor(Math.random() * companies.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            this.addNotification({
                companyName: randomCompany.name,
                position: randomCompany.position,
                status: randomStatus,
                timestamp: new Date().toISOString(),
                message: messages[randomStatus]
            });
        }, 30000); // Generate notification every 30 seconds for demo
    }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
