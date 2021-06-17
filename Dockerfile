FROM node:12

# Add Tini https://github.com/krallin/tini#using-tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]

COPY . /home/app
WORKDIR /home/app
RUN npm install
ENV PATH=${PATH}:/home/app
EXPOSE 5555
CMD [ "npm", "start" ]