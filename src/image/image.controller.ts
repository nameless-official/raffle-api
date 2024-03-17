import { BadRequestException, Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import * as sharp from 'sharp';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';
import { Roles } from 'src/role/role.decorator';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

@ApiBearerAuth()
@Roles('admin')
@ApiTags('Images')
@Controller('images')
export class ImagesController {
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(new BadRequestException('Es necesario cargar una imagen en formago jpg, jpeg o png'), false);
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image',
    type: FileUploadDto,
  })
  async uploadImage(@UploadedFile() file, @Body() fileUploadDto: FileUploadDto) {
    if (!file) {
      throw new BadRequestException('Se debe enviar una imagen para utilizar este endpoint.');
    }
    const originalImageName = `${Date.now()}-${file.originalname}`;

    const originalImage = sharp(file.buffer);
    const metadata = await originalImage.metadata();

    const thumbnailImageName = `thumbnail-${originalImageName}`;

    let compressedImageBuffer = file.buffer;

    if (metadata.width > 300) {
      compressedImageBuffer = await sharp(file.buffer).resize({ width: 300 }).toBuffer();
    }
    const originalFile = getStorage().bucket().file(`${fileUploadDto.container}/${originalImageName}`);
    const thumbnailFile = getStorage().bucket().file(`${fileUploadDto.container}/${thumbnailImageName}`);
    await originalFile.save(originalImage);
    await thumbnailFile.save(compressedImageBuffer);

    const originalUrl = await getDownloadURL(originalFile);
    const thumbnailUrl = await getDownloadURL(thumbnailFile);

    return { originalUrl, thumbnailUrl };
  }
}
