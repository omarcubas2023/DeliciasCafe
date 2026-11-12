USE delicias_cafe;
SELECT id, nombre FROM productos ORDER BY nombre;
-- Actualizar imágenes de todos los productos
SET SQL_SAFE_UPDATES = 0;

UPDATE productos SET imagen = 'https://excelso77.com/wp-content/uploads/2024/05/por-que-el-cafe-americano-se-llama-asi-te-lo-contamos.webp' WHERE nombre = 'Café Americano';
UPDATE productos SET imagen = 'https://t4.ftcdn.net/jpg/01/55/79/11/360_F_155791133_z8cGolAA1R2YrOYt8Uo5r9KxGifREs74.jpg' WHERE nombre = 'Cappuccino';
UPDATE productos SET imagen = 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Caffe_Latte.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original' WHERE nombre = 'Latte';
UPDATE productos SET imagen = 'https://t4.ftcdn.net/jpg/03/77/05/77/360_F_377057713_K5iwmUmR5VsiNdUmyv7Z7FJ9mvewHBnR.jpg' WHERE nombre = 'Mocha';
UPDATE productos SET imagen = 'https://cdn.shopify.com/s/files/1/0568/0768/6207/files/te-verde-2.jpg?v=1759320067' WHERE nombre = 'Té Verde';
UPDATE productos SET imagen = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIpqUKeuhR2q6JlrcAsZKsLdFLilHWlAyhA&s' WHERE nombre = 'Croissant';
UPDATE productos SET imagen = 'https://www.shutterstock.com/image-photo/banana-muffins-chocolate-chips-breakfast-260nw-2669602101.jpg' WHERE nombre = 'Muffin';
UPDATE productos SET imagen = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZcdQUWBtZgXe1Nej2cLBJeIJXiqcFd6pAeA&s' WHERE nombre = 'Bagel';
UPDATE productos SET imagen = 'https://media.istockphoto.com/id/1397193477/es/foto/s%C3%A1ndwich-club-elaborado-con-jam%C3%B3n-tocino-queso-lechuga-y-tomate.jpg?s=612x612&w=0&k=20&c=PmJpBzE9u7Tk_d6NJ5Unqh0gXh4iDuCgFHuG-SR-hIg=' WHERE nombre = 'Sándwich Club';
UPDATE productos SET imagen = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpi28zFDsiUJYvmtQkUGsgqyA6AIAw3ZiOoQ&s' WHERE nombre = 'Ensalada César';
UPDATE productos SET imagen = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfMzzo7pocBOONlxDf-KclmBccQYk2LpD0ew&s' WHERE nombre = 'Wrap de Pollo';
UPDATE productos SET imagen = 'https://www.micheldumas.com/wp-content/uploads/2025/05/tiramisu1-ezgif.com-jpg-to-webp-converter-1-1.webp' WHERE nombre = 'Tiramisú';
UPDATE productos SET imagen = 'https://www.shutterstock.com/image-photo/rich-brownie-topped-scoop-vanilla-600nw-2627792239.jpg' WHERE nombre = 'Brownie con Helado';
UPDATE productos SET imagen = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc4D_29lk48zVbeRqwOz547VQ7MG734I4Wjw&s' WHERE nombre = 'Flan de Caramelo';
UPDATE productos SET imagen = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4kbuJLGlibFxKacjn1nF9c46KgQd-PMVOEw&s' WHERE nombre = 'Desayuno Completo';
UPDATE productos SET imagen = 'https://hips.hearstapps.com/hmg-prod/images/best-homemade-pancakes-index-640775a2dbad8.jpg?crop=0.8890503582601677xw:1xh;center,top&resize=1200:*' WHERE nombre = 'Pancakes';
UPDATE productos SET imagen = 'https://granvita.com/wp-content/uploads/2024/03/bowl-de-avena-con-fruta.jpg' WHERE nombre = 'Avena con Frutas';