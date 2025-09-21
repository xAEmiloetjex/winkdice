export const treeNodeStubWithOptionsA = {
    id: 'treeNodeStubWithOptionsA',
    label: 'someLabelA',
    options: ['treeNodeStubWithOptionsB']
};
export const treeNodeStubWithOptionsB = {
    id: 'treeNodeStubWithOptionsB',
    label: 'someLabelB',
    options: ['treeNodeStubNoOptions']
};
export const treeNodeStubNoOptions = {
    id: 'treeNodeStubNoOptions',
    label: 'somelabelNoOptions',
    path: 'some/path/NoOptions',
    docType: 'someDocTypeNoOptions'
};
export const treeNodeInitialStub = {
    initial: {
        id: 'initial',
        options: ['treeNodeStubWithOptionsA']
    }
};
export const treeStub = {
    [treeNodeStubWithOptionsA.id]: treeNodeStubWithOptionsA,
    [treeNodeStubWithOptionsB.id]: treeNodeStubWithOptionsB,
    [treeNodeStubNoOptions.id]: treeNodeStubNoOptions,
    ...treeNodeInitialStub
};
