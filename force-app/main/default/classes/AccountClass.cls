public with sharing class AccountClass {
  @AuraEnabled(cacheable=true)
  public static List<Account> getAccounts(String searchTextClass) {
    try {
      if (String.isEmpty(searchTextClass)) {
        return [SELECT Id, Name FROM Account WITH SECURITY_ENFORCED];
      } else {
        searchTextClass = '%' + searchTextClass + '%';
        return [
          SELECT Id, Name
          FROM Account
          WHERE Name LIKE :searchTextClass
          WITH SECURITY_ENFORCED
        ];
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static List<Contact> getAccountContacts(Id accountId) {
    try {
      return [
        SELECT Id, Name
        FROM Contact
        WHERE AccountId = :accountId
        WITH SECURITY_ENFORCED
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
