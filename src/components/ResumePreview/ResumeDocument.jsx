import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import ustLogo from "../../assets/ust-logo.jpg";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.6,
    padding: 0,
  },
  paddedPage: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.6,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 35,
  },
  headerBlock: {
    backgroundColor: "#231F20",
    padding: 20,
    width: "100%",
    height: "13%",
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: "20%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  logoImage: {
    width: 140,
    height: 70,
    objectFit: "contain",
  },
  nameContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
  },
  twoColumnSection: {
    flexDirection: "row",
    gap: 20,
  },
  leftColumn: {
    width: "45%",
    flexDirection: "column",
    padding: 10,
    backgroundColor: "#006e74",
    borderRadius: 2,
    marginLeft: 15,
    marginBottom: 10,
  },
  rightColumn: {
    width: "55%",
    flexDirection: "column",
    paddingLeft: 10,
    marginRight: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#ffffff",
    paddingBottom: 4,
  },
  sectionTitleRight: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#1c2a3a",
    paddingBottom: 4,
  },
  item: {
    marginBottom: 10,
  },
  text: {
    fontSize: 10,
    color: "#ffffff",
    marginBottom: 3,
  },
  textRight: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 4,
  },
  boldingText: {
    fontWeight: "bold",
  },
  expSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1c2a3a",
  },
  expEntry: {
    marginBottom: 20,
  },
  responsibilityText: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 3,
    marginLeft: 10,
  },
});

const ResumeDocument = ({ data }) => {
  if (!data) {
    return (
      <Document>
        <Page>
          <Text>No resume data provided.</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {/* Page 1 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBlock}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoImage} src={ustLogo} />
          </View>
          <View style={styles.nameContainer}>
            {data.name && <Text style={styles.name}>{data.name}</Text>}
          </View>
        </View>

        <View style={styles.twoColumnSection}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            {/* Technical Expertise */}
            {data.technicalExpertise &&
              Object.keys(data.technicalExpertise).length > 0 && (
                <View style={styles.item}>
                  <Text style={styles.sectionTitle}>Technical Expertise:</Text>
                  {Object.entries(data.technicalExpertise).map(
                    ([category, items], i) =>
                      Array.isArray(items) &&
                      items.length > 0 && (
                        <Text key={i} style={styles.text}>
                          <Text style={{ fontWeight: "bold" }}>
                            • {category}:
                          </Text>{" "}
                          {items.join(", ")}
                        </Text>
                      )
                  )}
                </View>
              )}

            {/* Certifications */}
            {Array.isArray(data.certifications) &&
              data.certifications.length > 0 && (
                <View style={styles.item}>
                  <Text style={styles.sectionTitle}>Certifications:</Text>
                  {data.certifications.map((cert, i) => (
                    <Text key={i} style={styles.text}>
                      • {cert}
                    </Text>
                  ))}
                </View>
              )}
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            {Array.isArray(data.summary) && data.summary.length > 0 && (
              <View style={styles.item}>
                <Text style={styles.sectionTitleRight}>Profile Summary:</Text>
                {data.summary.map((line, i) => (
                  <Text key={i} style={styles.textRight}>
                    • {line}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* Page 2: Experience */}
      {(Array.isArray(data.experience) && data.experience.length > 0) ||
      (Array.isArray(data.education) && data.education.length > 0) ? (
        <Page size="A4" style={styles.paddedPage}>
          {/* Professional Experience */}
          {Array.isArray(data.experience) && data.experience.length > 0 && (
            <View>
              <Text style={styles.expSectionTitle}>
                Professional Experience
              </Text>
              {data.experience.map((exp, index) => (
                <View key={index} style={styles.expEntry}>
                  {exp.company && (
                    <Text style={styles.textRight}>
                      <Text style={styles.boldingText}>• Company:</Text>{" "}
                      {exp.company}
                    </Text>
                  )}
                  {exp.date && (
                    <Text style={styles.textRight}>
                      <Text style={styles.boldingText}>• Date:</Text> {exp.date}
                    </Text>
                  )}
                  {exp.role && (
                    <Text style={styles.textRight}>
                      <Text style={styles.boldingText}>• Role:</Text> {exp.role}
                    </Text>
                  )}
                  {exp.clientEngagement && (
                    <Text style={styles.textRight}>
                      <Text style={styles.boldingText}>
                        • Client Engagement:
                      </Text>{" "}
                      {exp.clientEngagement}
                    </Text>
                  )}
                  {exp.program && (
                    <Text style={styles.textRight}>
                      <Text style={styles.boldingText}>• Program:</Text>{" "}
                      {exp.program}
                    </Text>
                  )}
                  {Array.isArray(exp.responsibilities) &&
                    exp.responsibilities.length > 0 && (
                      <>
                        <Text
                          style={[
                            styles.textRight,
                            styles.boldingText,
                            { marginTop: 5 },
                          ]}
                        >
                          RESPONSIBILITIES:
                        </Text>
                        {exp.responsibilities.map((res, i) => (
                          <Text key={i} style={styles.responsibilityText}>
                            • {res}
                          </Text>
                        ))}
                      </>
                    )}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {Array.isArray(data.education) && data.education.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.expSectionTitle}>Education</Text>
              {data.education.map((edu, i) => (
                <Text key={i} style={styles.textRight}>
                  • {edu.degree} from {edu.university}
                </Text>
              ))}
            </View>
          )}
        </Page>
      ) : null}
    </Document>
  );
};

export default ResumeDocument;
