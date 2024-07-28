public with sharing class EventRegistrationController {

    @AuraEnabled(cacheable=true)
    public static List<Event_Demo__c> getAvailableEvents() {
        return [SELECT Id, Name, Maximum_Capacity__c, 
                       (SELECT Id FROM Registrations__r) 
                FROM Event_Demo__c 
                WHERE Event_Date__c >= TODAY];
    }

    @AuraEnabled
    public static void registerForEvent(Id eventId, String participantName, String email) {
        try {
            // Retrieve the event record to check current capacity
            Event_Demo__c event = [
                SELECT Id, Name, Maximum_Capacity__c, 
                       (SELECT Id FROM Registrations__r) 
                FROM Event_Demo__c 
                WHERE Id = :eventId 
                LIMIT 1
            ];

            Integer currentRegistrations = event.Registrations__r.size();
            Integer maxCapacity = (event.Maximum_Capacity__c != null) ? Integer.valueOf(event.Maximum_Capacity__c) : 0;

            String status;
            if (currentRegistrations < maxCapacity) {
                status = 'Registered';
            } else {
                status = 'Pending';
            }

            // Create the registration record
            Registration__c newRegistration = new Registration__c(
                Associated_Event__c = eventId,
                Participant_Name__c = participantName,
                Email__c = email,
                Registration_Status__c = status
            );
            insert newRegistration;

        } catch (Exception e) {
            throw new AuraHandledException('Error registering for event: ' + e.getMessage());
        }
    }
}
