import Drawing from '../dist/index.js';
import fs from 'fs';

try {
    const d = new Drawing();
    d.setUnits('Meters');
    d.drawPoint(0, 0);
    d.drawCircle(10, 10, 5);
    d.drawText(20, 20, 2, 0, "Hello ESM");
    const content = d.toDxfString();
    fs.writeFileSync('test_esm.dxf', content);
    console.log('ESM DXF generated successfully');
} catch (e) {
    console.error('Error generating DXF:', e);
    process.exit(1);
}
