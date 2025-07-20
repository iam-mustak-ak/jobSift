import {
    Document,
    Page,
    PDFViewer,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "#E4E4E4",
        transform: "scale(1)",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
});

const PdfViewer = () => {
    return (
        <PDFViewer
            className="w-full h-full border-0 outline-none"
            showToolbar={false}
            width={200}
        >
            <Document pageMode="useNone">
                <Page style={styles.page}>
                    <View style={styles.section}>
                        <Text>Section #1</Text>
                        <Text>Section hello</Text>
                    </View>
                    <View style={styles.section}>
                        <Text>Section #2</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default PdfViewer;
