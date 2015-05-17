function ready(meshes) {
    app.meshes = meshes;
    canvas = document.getElementById("gl-canvas");
    initGL(canvas);

}



window.onload = function() {
    OBJ.downloadMeshes({
            'spaceship': 'assets/models/higher-poly-spaceship.obj',
            'skybox': 'assets/models/cube.obj',
            'planet': 'assets/models/sphere.obj',
        },
        ready);
}