import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Int "mo:core/Int";

actor {
  include MixinStorage();

  public type WoundEntry = {
    photo : Storage.ExternalBlob;
    contentType : Text;
    timestamp : Time.Time;
    questionnaireResponses : Text;
    generatedReport : Text;
  };

  module WoundEntry {
    public func compare(w1 : WoundEntry, w2 : WoundEntry) : Order.Order {
      Int.compare(w2.timestamp, w1.timestamp);
    };
  };

  let entries = Map.empty<Principal, List.List<WoundEntry>>();

  public shared ({ caller }) func addWoundEntry(photo : Storage.ExternalBlob, contentType : Text, questionnaireResponses : Text, generatedReport : Text) : async () {
    let newEntry = {
      photo;
      contentType;
      timestamp = Time.now();
      questionnaireResponses;
      generatedReport;
    };

    let existingEntries = switch (entries.get(caller)) {
      case (null) { List.empty<WoundEntry>() };
      case (?entryList) { entryList };
    };

    existingEntries.add(newEntry);
    entries.add(caller, existingEntries);
  };

  public query ({ caller }) func getWoundHistory() : async [WoundEntry] {
    switch (entries.get(caller)) {
      case (null) { Runtime.trap("No entry found for caller: " # caller.toText()) };
      case (?entryList) { entryList.values().toArray().sort() };
    };
  };
};
