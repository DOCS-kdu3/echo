import { PusherChannel } from './pusher-channel';
import { PresenceChannel } from './presence-channel';

/**
 * This class represents a Pusher presence channel.
 */
export class PusherPresenceChannel extends PusherChannel implements PresenceChannel {
    /**
     * Register a callback to be called anytime the member list changes.
     */
    here(callback: Function): PusherPresenceChannel {
        this.on('pusher:subscription_succeeded', (data : any) => {
            callback(Object.keys(data.members).map((k) => data.members[k]));
        });

        return this;
    }

    /**
     * Listen for someone joining the channel.
     */
    joining(callback: Function): PusherPresenceChannel {
        this.on('pusher:member_added', (member : any) => {
            callback(member.info);
        });

        return this;
    }

    /**
     * Listen for someone leaving the channel.
     */
    leaving(callback: Function): PusherPresenceChannel {
        this.on('pusher:member_removed', (member : any) => {
            callback(member.info);
        });

        return this;
    }

    /**
     * Trigger client event on the channel.
     */
    whisper(eventName: string, data: any): PusherPresenceChannel {
        this.pusher.channels.channels[this.name].trigger(`client-${eventName}`, data);

        return this;
    }

    /**
     * Listen for an event on the channel instance.
     */
    listen(event: string, callback: Function): PusherPresenceChannel {
        this.on(this.eventFormatter.format(event), callback);

        return this;
    }
}
