import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAvailableEvents from '@salesforce/apex/EventRegistrationController.getAvailableEvents';
import registerForEvent from '@salesforce/apex/EventRegistrationController.registerForEvent';

export default class EventRegistrationForm extends LightningElement {
    @track events = [];
    @track selectedEvent = '';
    @track participantName = '';
    @track email = '';

    @wire(getAvailableEvents)
    wiredEvents({ error, data }) {
        if (data) {
            this.events = data.map(event => ({
                label: event.Name,
                value: event.Id
            }));
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading events',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    handleEventChange(event) {
        this.selectedEvent = event.target.value;
    }

    handleInputChange(event) {
        const field = event.target.name;
        if (field === 'participantName') {
            this.participantName = event.target.value;
        } else if (field === 'email') {
            this.email = event.target.value;
        }
    }

    register() {
        registerForEvent({
            eventId: this.selectedEvent,
            participantName: this.participantName,
            email: this.email,
            registrationStatus: 'Registered' // Ensure this matches the valid picklist value
        })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Registered successfully',
                        variant: 'success'
                    })
                );
                this.resetForm();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error registering for event',
                        message: error.body.message || 'Unknown error',
                        variant: 'error'
                    })
                );
            });
    }

    resetForm() {
        this.selectedEvent = '';
        this.participantName = '';
        this.email = '';
    }
}

