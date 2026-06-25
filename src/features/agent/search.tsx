import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plane, Hotel, Package } from "lucide-react";
import { FlightSearch } from "./search/flights";
import { HotelSearch } from "./search/hotels";
import { PackagesSearch } from "./search/packages";

export function SearchBook() {
  return (
    <Tabs defaultValue="flights">
      <TabsList>
        <TabsTrigger value="flights"><Plane className="h-4 w-4 mr-1.5" />Flights</TabsTrigger>
        <TabsTrigger value="hotels"><Hotel className="h-4 w-4 mr-1.5" />Hotels</TabsTrigger>
        <TabsTrigger value="packages"><Package className="h-4 w-4 mr-1.5" />Holiday Packages</TabsTrigger>
      </TabsList>
      <TabsContent value="flights" className="mt-4 space-y-5"><FlightSearch /></TabsContent>
      <TabsContent value="hotels" className="mt-4 space-y-5"><HotelSearch /></TabsContent>
      <TabsContent value="packages" className="mt-4 space-y-5"><PackagesSearch /></TabsContent>
    </Tabs>
  );
}
