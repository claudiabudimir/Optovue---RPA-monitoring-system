import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Response } from 'express';
import { readdir, statSync, unlink } from 'fs';
import { VIDEO_PATH } from 'src/constants';

@Injectable()
export class VideoService {
  //to get full session video
  getVideoFromDatabase(name: string, range: string, res: Response): any {
    const path = VIDEO_PATH + name;
    if (path === VIDEO_PATH) {
      throw new HttpException(
        'Error 404, no video found with that name.',
        HttpStatus.NOT_FOUND,
      );
    }

    const head = {
      'Content-Type': 'video/mp4',
      'Access-Control-Allow-Origin': '*',
    };
    res.set(head);
    res.status(200);

    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg(path)
      .videoCodec('copy')
      .audioCodec('copy')
      .outputFormat('mp4')
      .outputOptions(['-movflags frag_keyframe+empty_moov'])
      .pipe(res, { end: true });
  }

  timeStringToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':');
    const totalSeconds = +hours * 60 * 60 + +minutes * 60 + +seconds;
    return totalSeconds;
  }

  cropVideo(
    sessionid: string,
    startTime: string,
    endTime: string,
    res: Response,
  ): any {
    console.log('here: ', startTime, ' - ', endTime);

    const path = VIDEO_PATH + sessionid + '.mp4';
    if (path === VIDEO_PATH) {
      throw new HttpException(
        'Error 404, no video found with that name.',
        HttpStatus.NOT_FOUND,
      );
    }

    const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
    const ffmpeg = require('fluent-ffmpeg');
    ffmpeg.setFfmpegPath(ffmpegPath);
    const duration =
      this.timeStringToSeconds(endTime) - this.timeStringToSeconds(startTime);

    console.log('duration: ', duration);

    const head = {
      'Content-Type': 'video/mp4',
      'Access-Control-Allow-Origin': '*',
    };
    res.set(head);

    ffmpeg(path)
      .setStartTime(startTime)
      .setDuration(duration)
      .videoCodec('copy')
      .audioCodec('copy')
      .outputFormat('mp4')
      .outputOptions(['-movflags frag_keyframe+empty_moov'])
      .pipe(res, { end: true });
  }

  @Interval(3600000) //repeat every hour
  deleteOldVideos() {
    const currentTime = new Date(Date.now());
    readdir(VIDEO_PATH, (err, files) => {
      files.forEach((file) => {
        const { birthtime } = statSync(VIDEO_PATH + file);
        const timeDiff = Math.abs(currentTime.valueOf() - birthtime.valueOf());
        if (timeDiff > 604800000) {
          // 604800000 = number of milliseconds in 7 days
          unlink(VIDEO_PATH + file, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  }
}
