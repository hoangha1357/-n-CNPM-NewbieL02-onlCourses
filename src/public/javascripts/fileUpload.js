
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

FilePond.setOptions({ 
    stylePanelAspectRatio: 'auto', 
    imageResizeTargetWidth: 160,
    imageResizeTargetHeight: 100,
})

FilePond.parse(document.body);
