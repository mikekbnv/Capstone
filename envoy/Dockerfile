FROM envoyproxy/envoy:dev-21af65095760db381347c031971aa5b3668b8968
COPY envoy.yaml /etc/envoy/envoy.yaml
RUN chmod go+r /etc/envoy/envoy.yaml



# FROM envoyproxy/envoy:v1.14.3
# COPY ./envoy.yaml /etc/envoy/envoy.yaml
# EXPOSE 5000
# CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml