import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles as s } from "../styles";

interface SlotData {
  company_name_ne: string;
  company_registration_no: string;
  application_date_bs: string;
  change_reason: string;
  applicant_name_ne: string;
  applicant_designation: string;
  new_user_id: string;
  new_email: string;
  new_phone: string;
  resolution_date_bs: string;
  resolution_time: string;
  meeting_venue_ne: string;
  chairperson_name_ne: string;
  authorized_person_ne: string;
  board_attendees: Array<{ name_ne: string; designation_ne: string }>;
  attached_documents: Array<{ document_name_ne: string }>;
}

export function CompanyUserIdChangeDocument({ data }: { data: SlotData }) {
  return (
    <Document>
      {/* Part 1: Application Letter */}
      <Page size="A4" style={s.page}>
        <View style={s.letterhead}>
          <Text style={s.h2}>{data.company_name_ne}</Text>
        </View>

        <Text style={s.date}>मिति: {data.application_date_bs}</Text>

        <View style={s.addressee}>
          <Text>श्रीमान् कम्पनी रजिष्ट्रार ज्यू</Text>
          <Text>कम्पनी रजिष्ट्रारको कार्यालय</Text>
          <Text>त्रिपुरेश्वर, काठमाण्डौ।</Text>
        </View>

        <Text style={s.subject}>
          <Text style={s.bold}>
            विषय: कम्पनीको नयाँ यूजर आईडी तथा पासवर्ड सम्बन्धमा।
          </Text>
        </Text>

        <Text style={s.p}>महोदय,</Text>

        <Text style={s.p}>
          उपरोक्त सम्बन्धमा यस {data.company_name_ne} (
          {data.company_registration_no}) को {data.change_reason} उक्त विवरण
          परिवर्तन गर्न आवश्यक पर्ने तपसिल बमोजिमका कागजातहरु संलग्न गरी यो
          निवेदन पेश गरेको छु। कागजातहरु रुजु गरी कम्पनीको यूजर आईडी, इमेल
          ठेगाना तथा मोवाइल नम्बर परिवर्तन गरी पाउँन सादर अनुरोध गर्दछु।
        </Text>

        <View style={s.section}>
          <Text style={s.bold}>संलग्न कागजातहरू</Text>
          <View style={s.ol}>
            {data.attached_documents.map((doc, i) => (
              <Text key={i} style={s.olItem}>
                {i + 1}. {doc.document_name_ne}
              </Text>
            ))}
          </View>
        </View>

        <View style={s.signatureBlock}>
          <Text>निवेदक</Text>
          <Text style={s.bold}>{data.applicant_name_ne}</Text>
          <Text>{data.applicant_designation}</Text>
        </View>
      </Page>

      {/* Part 2: Board Resolution */}
      <Page size="A4" style={s.page}>
        <View style={s.resolutionHeader}>
          <Text style={s.h2}>{data.company_name_ne}</Text>
          <Text>को</Text>
          <Text style={s.h3}>संचालक समितिको बैठकको निर्णय</Text>
        </View>

        <Text style={s.p}>
          आज मिति {data.resolution_date_bs} गतेका दिन {data.resolution_time} यस{" "}
          {data.company_name_ne} को संचालक समितिको बैठक{" "}
          {data.meeting_venue_ne}मा अध्यक्ष {data.chairperson_name_ne} को
          अध्यक्षतामा बसी तपसिल बमोजिम निर्णयहरू पारित गरियो।
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
            {data.board_attendees.map((attendee, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={[s.tableCell, { flex: 0.5 }]}>{i + 1}.</Text>
                <Text style={s.tableCell}>{attendee.name_ne}</Text>
                <Text style={s.tableCell}>{attendee.designation_ne}</Text>
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

        {/* Agenda */}
        <View style={s.section}>
          <Text style={s.bold}>छलफलका लागि प्रस्ताव गरिएका विषयहरुः</Text>
          <View style={s.ol}>
            <Text style={s.olItem}>
              १. कम्पनीको नयाँ यूजर आईडी तथा पासवर्ड सम्बन्धमा।
            </Text>
            <Text style={s.olItem}>२. सनाखतको अख्तियारी सम्बन्धमा।</Text>
            <Text style={s.olItem}>३. विविध।</Text>
          </View>
        </View>

        {/* Decisions */}
        <View style={s.section}>
          <Text style={s.bold}>निर्णयहरुः</Text>

          <Text style={s.p}>
            <Text style={s.bold}>१.</Text> प्रस्ताव नं.१ माथि छलफल हुँदा यस
            प्रा.लि. को साविकमा कायम रहेको यूजर आईडी तथा पासवर्ड, मोबाइल नम्बर
            हाल प्रयोगमा नरहेको हुँदा उक्त विवरण परिवर्तन गर्न आवश्यक भएको
            हुँदा तपसिल बमोजिम हुने गरी विवरणहरु परिवर्तन गर्ने निर्णय गरियो।
          </Text>

          <View style={s.newCredentials}>
            <Text>कम्पनीको प्रस्तावित नयाँ</Text>
            <Text>यूजर आई डिः {data.new_user_id}</Text>
            <Text>इमेल ठेगाना: {data.new_email}</Text>
            <Text>फोन नम्बर: {data.new_phone}</Text>
          </View>

          <Text style={s.p}>
            <Text style={s.bold}>२.</Text> प्रस्ताव नं.२ माथि छलफल हुँदा
            निर्णय नम्बर १ बमोजिमको कार्य गर्नको लागि कम्पनी रजिष्ट्रारको
            कार्यालयमा उपस्थित भई सनाखत गर्नको लागि सञ्चालक श्री{" "}
            {data.authorized_person_ne} लाई अख्तियारी प्रदान गर्ने निर्णय
            गरियो।
          </Text>

          <Text style={s.p}>
            <Text style={s.bold}>३.</Text> अन्त्यमा, छलफलका अन्य विषय
            नभएकाले अध्यक्षज्यूले उपस्थित सबै महानुभावहरुलाई धन्यवाद ज्ञापन
            गर्दै बैठक समापन भएको घोषणा गर्नुभयो।
          </Text>
        </View>
      </Page>
    </Document>
  );
}
