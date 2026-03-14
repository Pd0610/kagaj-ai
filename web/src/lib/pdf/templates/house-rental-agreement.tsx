import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles as s } from "../styles";

interface SlotData {
  landlord_name: string;
  tenant_name: string;
  property_address: string;
  monthly_rent: string;
  agreement_start: string;
  agreement_duration: string;
}

export function HouseRentalAgreementDocument({ data }: { data: SlotData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.letterhead}>
          <Text style={s.h2}>घर भाडा सम्झौता</Text>
        </View>

        <Text style={s.p}>
          यो घर भाडा सम्झौता मिति {data.agreement_start} मा निम्न दुई
          पक्षहरूबीच भएको छ:
        </Text>

        <View style={s.section}>
          <Text style={s.bold}>पक्ष १ (घरधनी):</Text>
          <Text style={s.p}>नाम: {data.landlord_name}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.bold}>पक्ष २ (भाडावाल):</Text>
          <Text style={s.p}>नाम: {data.tenant_name}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.bold}>सम्पत्ति विवरण:</Text>
          <Text style={s.p}>ठेगाना: {data.property_address}</Text>
        </View>

        <View style={s.section}>
          <Text style={s.bold}>सम्झौताका सर्तहरू:</Text>
          <View style={s.ol}>
            <Text style={s.olItem}>
              १. मासिक भाडा रु. {data.monthly_rent} (
              {numberToNepaliWords(Number(data.monthly_rent))}) हुनेछ।
            </Text>
            <Text style={s.olItem}>
              २. सम्झौताको अवधि {data.agreement_duration} महिना हुनेछ।
            </Text>
            <Text style={s.olItem}>
              ३. भाडा प्रत्येक महिनाको ५ गते भित्र बुझाउनु पर्नेछ।
            </Text>
            <Text style={s.olItem}>
              ४. सम्झौता अवधि समाप्त हुनुभन्दा कम्तीमा एक महिना अगावै
              कुनै एक पक्षले अर्को पक्षलाई लिखित सूचना दिई सम्झौता समाप्त
              गर्न सक्नेछ।
            </Text>
            <Text style={s.olItem}>
              ५. भाडावालले घर तथा सम्पत्तिको राम्रोसँग हेरचाह गर्नुपर्नेछ।
            </Text>
            <Text style={s.olItem}>
              ६. घरधनीको लिखित अनुमति बिना भाडावालले घरमा कुनै संरचनात्मक
              परिवर्तन गर्न पाउने छैन।
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 48,
          }}
        >
          <View>
            <Text>___________________</Text>
            <Text style={s.bold}>{data.landlord_name}</Text>
            <Text>घरधनी</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text>___________________</Text>
            <Text style={s.bold}>{data.tenant_name}</Text>
            <Text>भाडावाल</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function numberToNepaliWords(n: number): string {
  // Simple placeholder — returns the number in Nepali digits
  const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(n).replace(/\d/g, (d) => nepaliDigits[Number(d)] ?? d);
}
