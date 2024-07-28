public with sharing class eventController {
    @AuraEnabled
    public static void createEvent(String name, String eventDate, String location, Integer capacity) {
        // Parse eventDate string to Date
        Date parsedEventDate = Date.valueOf(eventDate);

        // Create a new Event_Demo__c record
        Event_Demo__c newEvent = new Event_Demo__c(
            Name = name,
            Event_Date__c = parsedEventDate,
            Event_Location__c = location,
            Maximum_capacity__c = capacity
        );

        // Insert the newEvent record
        insert newEvent;
    }
}
