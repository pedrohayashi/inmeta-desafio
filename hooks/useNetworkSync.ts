import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import Realm from "realm";
import { synchronizeWorkOrders } from "../utils/syncWorkOrders";

export const useNetworkSync = (realm: Realm) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        synchronizeWorkOrders(realm);
      }
    });

    return () => unsubscribe();
  }, [realm]);
};