function ready(meshes) {
    app.meshes = meshes;
    canvas = document.getElementById("gl-canvas");
    initGL(canvas);

}



window.onload = function() {
    OBJ.downloadMeshes({
            'spaceship': 'assets/models/low-poly-spaceship.obj',
        },
        ready);
}