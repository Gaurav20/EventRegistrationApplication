import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createEvent from '@salesforce/apex/EventController.createEvent';

export default class Event_Creation_Lwc extends LightningElement {
    @track eventName = '';
    @track eventDate = '';
    @track eventLocation = '';
    @track eventCapacity = '';

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'eventName') {
            this.eventName = event.target.value;
        } else if (field === 'eventDate') {
            this.eventDate = event.target.value;
        } else if (field === 'eventLocation') {
            this.eventLocation = event.target.value;
        } else if (field === 'eventCapacity') {
            this.eventCapacity = event.target.value;
        }
    }

    createEvent() {
        // Convert the eventDate string to a Date object
        const eventDateObj = new Date(this.eventDate);

        createEvent({
            name: this.eventName,
            eventDate: eventDateObj.toISOString(),  // Convert to ISO string format
            location: this.eventLocation,
            capacity: parseInt(this.eventCapacity, 10)  // Ensure capacity is parsed as an integer
        })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Event created successfully',
                        variant: 'success'
                    })
                );
                this.resetForm();  // Added this line to reset the form
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating event',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    resetForm() {  // Added the resetForm method
        this.eventName = '';
        this.eventDate = '';
        this.eventLocation = '';
        this.eventCapacity = '';
    }
}

