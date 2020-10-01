
class PowerBar extends THREE.Object3D 
{
    currentPow = 0;
    barMax = 1;
    barMesh;
    barScaler = new THREE.Object3D();
    backMesh;
    constructor(height, material, backMaterial) 
    {
        super();
        this.barMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(20, 20, height,32,1), material);
        this.barMesh.position.y = height/2;
        this.backMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(20, 20, height,32,1), backMaterial);
        this.backMesh.position.y = height/2;
        this.backMesh.position.z = -20;
        this.barScaler.add(this.barMesh);
        this.add(this.backMesh);
        this.add(this.barScaler);
        this.visible = false;
    }
};

PowerBar.prototype = Object.create(THREE.Object3D.prototype);
PowerBar.prototype.constructor = PowerBar;

PowerBar.prototype.power = function(pow)
{
	this.barScaler.scale.y = pow;
}