const Drawing = require('../dist/index');
const fs = require('fs');

try {
    const d = new Drawing();
    d.setUnits('Meters');
    d.drawPoint(0, 0);
    d.drawCircle(10, 10, 5);
    d.drawText(20, 20, 2, 0, "Hello DXF");
    const content = d.toDxfString();
    fs.writeFileSync('test.dxf', content);
    console.log('DXF generated successfully');
} catch (e) {
    console.error('Error generating DXF:', e);
    process.exit(1);
}
