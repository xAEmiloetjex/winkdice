export function markAliases(log) {
    return new MarkAliases(log);
}
const getOriginalName = (doc) => doc.aliasSymbol.resolvedSymbol.escapedName;
class MarkAliases {
    log;
    $runAfter = ['readTypeScriptModules'];
    $runBefore = ['generateApiListDoc', 'createSitemap'];
    constructor(log) {
        this.log = log;
    }
    $process(docs) {
        docs
            .filter((doc) => doc.moduleDoc)
            .forEach((doc) => {
            const duplicateDocs = this.findDuplicateDocs(doc);
            if (duplicateDocs.length > 0) {
                duplicateDocs.forEach((duplicateDoc) => duplicateDoc.duplicateOf = doc);
                doc.renamedDuplicates = duplicateDocs;
                this.log.debug(`${doc.name} has the following aliases:`, duplicateDocs.map((doc) => doc.name).join(', '));
            }
        });
    }
    findDuplicateDocs(doc) {
        return doc.moduleDoc.exports
            .filter((exportedDoc) => exportedDoc !== doc
            && exportedDoc.aliasSymbol
            && getOriginalName(exportedDoc) === doc.name);
    }
}
