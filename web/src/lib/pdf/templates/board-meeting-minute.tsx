import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles as s } from "../styles";

interface SlotData {
  company_name: string;
  meeting_date: string;
  meeting_time: string;
  meeting_venue: string;
  chairperson_name: string;
  resolution_type: string;
  resolution_details: string;
  attendees: Array<{ name: string; designation: string }>;
}

export function BoardMeetingMinuteDocument({ data }: { data: SlotData }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.resolutionHeader}>
          <Text style={s.h2}>{data.company_name}</Text>
          <Text>को</Text>
          <Text style={s.h3}>सञ्चालक समिति बैठक मिनेट</Text>
        </View>

        <Text style={s.p}>
          आज मिति {data.meeting_date} गतेका दिन {data.meeting_time} यस{" "}
          {data.company_name} को सञ्चालक समितिको बैठक {data.meeting_venue}मा
          अध्यक्ष {data.chairperson_name} को अध्यक्षतामा बसी तपसिल बमोजिम
          निर्णयहरू पारित गरियो।
        </Text>

        {/* Attendees table */}
        <View style={s.section}>
          <Text style={s.bold}>उपस्थितीः</Text>
          <View style={s.table}>
            <View style={[s.tableRow, s.tableHeader]}>
              <Text style={[s.tableCellHeader, { flex: 0.5 }]}>क्र.सं.</Text>
              <Text style={s.tableCellHeader}>नाम</Text>
              <Text style={s.tableCellHeader}>पद</Text>
              <Text style={[s.tableCellHeader, { flex: 0.8 }]}>दस्तखत</Text>
            </View>
            {data.attendees.map((attendee, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={[s.tableCell, { flex: 0.5 }]}>{i + 1}.</Text>
                <Text style={s.tableCell}>{attendee.name}</Text>
                <Text style={s.tableCell}>{attendee.designation}</Text>
                <Text style={[s.tableCell, { flex: 0.8 }]}> </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quorum */}
        <View style={s.section}>
          <Text style={s.bold}>बैठकको गणपूरक संख्या</Text>
          <Text style={s.p}>
            कम्पनी ऐन तथा कम्पनीको नियमावली बमोजिम सञ्चालक समितिको बैठक
            बस्नको लागि आवश्यक गणपूरक संख्या पुगेको हुँदा आजको यस बैठकको काम
            कारवाही अगाडि बढाइयो।
          </Text>
        </View>

        {/* Resolution */}
        <View style={s.section}>
          <Text style={s.bold}>छलफलको विषय: {data.resolution_type}</Text>
          <Text style={s.p}>{data.resolution_details}</Text>
        </View>

        {/* Closing */}
        <Text style={s.p}>
          अन्त्यमा, छलफलका अन्य विषय नभएकाले अध्यक्षज्यूले उपस्थित सबै
          महानुभावहरुलाई धन्यवाद ज्ञापन गर्दै बैठक समापन भएको घोषणा
          गर्नुभयो।
        </Text>
      </Page>
    </Document>
  );
}
